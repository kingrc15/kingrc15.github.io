import re
import requests
from datetime import datetime, timedelta
from xml.etree import ElementTree as ET

import os
from datetime import datetime
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatHuggingFace

from langchain_huggingface import ChatHuggingFace, HuggingFacePipeline

from transformers import BitsAndBytesConfig

# Step 1: Load PDFs
def load_pdfs(pdf_folder):
    """Loads PDFs from a specified folder and converts them into documents."""
    documents = []
    for pdf_file in os.listdir(pdf_folder):
        if pdf_file.endswith(".pdf"):
            print(f"Processing {pdf_file}...")
            loader = PyPDFLoader(file_path=os.path.join(pdf_folder, pdf_file))
            loaded_documents = loader.load()  # Load the PDF content into documents

            # Optional: Add metadata to each document if needed (e.g., title, source)
            for doc in loaded_documents:
                doc.metadata = {"source": pdf_file}  # You can modify this to include more metadata if needed

            documents.extend(loaded_documents)  # Add to the document list
    return documents

# Step 2: Add PDFs to vector store
def integrate_pdfs_to_vector_store(pdf_folder):
    # Loads PDFs and updates the vector store with their content.
    pdf_documents = load_pdfs(pdf_folder)
    print(f"Adding {len(pdf_documents)} documents from PDFs to the vector store...")

    # Creates a FAISS vector store for document retrieval
    embeddings = HuggingFaceEmbeddings()
    vector_store = FAISS.from_documents(pdf_documents, embeddings)

    print("Vector store updated with PDF content.")
    return vector_store


# Step 3: Generate a blog post
def generate_blog_post(vector_store, title):
    """Generates a blog post using RetrievalQA and LangChain."""
    model_id = "/scratch/models/meta-llama/Llama-3.2-3B-Instruct"

    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype="float16",
        bnb_4bit_use_double_quant=True,
    )
    
    # Initialize the ChatHuggingFace with the required arguments
    llm = HuggingFacePipeline.from_model_id(
        model_id=model_id,
        task="text-generation",
        device="auto",
        pipeline_kwargs=dict(
            max_new_tokens=512,
            do_sample=False,
            repetition_penalty=1.03,
            return_full_text=False,
        ),
        model_kwargs={
            "quantization_config": quantization_config,
            "device_map":"auto",
        },
    )

    # Use the model_kwargs as part of the initialization
    chat_model = ChatHuggingFace(llm=llm)

    chat_model.llm.pipeline.tokenizer.pad_token_id = chat_model.llm.pipeline.tokenizer.eos_token_id

    qa_chain = RetrievalQA.from_chain_type(
        llm=chat_model,
        retriever=vector_store.as_retriever(),
        chain_type="stuff"
    )

    prompt = (
        f"""Write a blog post about the paper titled {title}. The blog post should be clear, engaging, and accessible for a general audience, with a professional tone. Focus on the following points:

        A brief introduction to the research problem or challenge the paper addresses.
        Key findings and contributions of the paper.
        Any potential real-world applications or impact of the research.
        A conclusion that ties everything together, highlighting the significance of the work and its potential future developments.
        Ensure that the content is informative yet easy to understand for a wide audience, and explain any complex terms or concepts in simple language."""
    )

    response = ""
    while len(response) == 0:
        response = qa_chain.run(prompt)

    response = generate_header(title) + response
    return response

def generate_header(title):
    return f"---\ntitle: {title}\nlayout: archive\ncategories:\n  - Generated\ntags:\n  - Multimodal\n  - EHR\n---\n"

# Step 4: Save the blog post
def save_blog_post(content, title):
    """Saves the generated blog post to a file."""
    date = datetime.now().strftime("%Y-%m-%d")
    title_list = title.lower().split(" ")
    filename = f"./_generated_posts/{date}-{'-'.join(title_list)}.md"
    with open(filename, "w") as file:
        file.write(content)
    print(f"Blog post saved as {filename}")

def remove_special_characters(input_string):
    # Use a regular expression to remove all characters that are not letters, digits, or spaces
    cleaned_string = re.sub(r'[^a-zA-Z0-9\s]', '', input_string)
    cleaned_string = cleaned_string.replace('\n', '')
    cleaned_string = cleaned_string.replace('--', '-')
    cleaned_string = cleaned_string.replace('  ', ' ')
    return cleaned_string

# Main script
def main_with_pdfs(pdf_folder, title):
    print("Updating vector store with PDF content...")
    vector_store = integrate_pdfs_to_vector_store(pdf_folder)

    print("Generating blog post...")
    blog_post = generate_blog_post(vector_store, title)

    return blog_post
    

def is_paper_in_folder(title, folder_path):
    # Check if a file with the paper's title exists in the folder (assumes title is part of the filename)
    filename = title.replace(' ', '_') + '.pdf'  # Simple filename creation strategy
    file_path = os.path.join(folder_path, filename)
    return os.path.exists(file_path)

def download_pdf(pdf_url, folder_path, title):
    # Generate a valid filename from the paper's title
    filename = title.replace(' ', '_') + '.pdf'
    file_path = os.path.join(folder_path, filename)

    # Send a GET request to download the PDF
    response = requests.get(pdf_url)
    response.raise_for_status()  # Ensure the request was successful

    # Write the content of the response to a PDF file in the specified folder
    with open(file_path, 'wb') as f:
        f.write(response.content)
    
    print(f"Downloaded and saved: {filename}")

if __name__ == "__main__":
    pdf_folder_path = "./assets/research_papers"  # Set the path to your folder containing PDFs

    # Get today's date and the date 24 hours ago
    today = datetime.now()
    last_week = today - timedelta(days=7)

    # Format the date range for the query (arXiv API uses YYYY-MM-DD format)
    today_str = today.strftime('%Y-%m-%d')
    last_week_str = last_week.strftime('%Y-%m-%d')

    # Construct the arXiv API query URL
    url = f'http://export.arxiv.org/api/query?search_query=all:multimodal+ehr&start=0&max_results=5'

    # Send the GET request
    response = requests.get(url)
    response.raise_for_status()

    # Parse the response (assuming it's in XML format)
    root = ET.fromstring(response.content)

    # Decode the binary response into a string
    response_str = response.text

    # Parse the XML string
    root = ET.fromstring(response_str)

    # Extract paper titles and links
    for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
        title = entry.find('{http://www.w3.org/2005/Atom}title').text
        link = entry.find('{http://www.w3.org/2005/Atom}link').attrib['href']
        pdf_url = link.replace('abs', 'pdf') + '.pdf'  # Modify the URL to point to the PDF

        title = remove_special_characters(title)

        if not is_paper_in_folder(title, pdf_folder_path):
            print(f"New Paper (not in {pdf_folder_path}):\nTitle: {title}\nLink: {link}\n")
            download_pdf(pdf_url, pdf_folder_path, title)
            break  # Stop after finding the first paper not in the folder

    blog_post = main_with_pdfs(pdf_folder_path, title)

    print("Saving blog post...")
    save_blog_post(blog_post, title)

