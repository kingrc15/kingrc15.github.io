window.onload = TypeQuote;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function TypeQuote() {
	var quote_block = document.getElementById("quote_wrapper");
	var quote_elem = quote_block.getElementsByTagName("a")[0];
	var author_elem = quote_block.getElementsByTagName("a")[1];
	var quote = quote_elem.innerHTML;
	var author = author_elem.innerHTML;
	var quote_string = "_";
	quote_elem.innerText = quote_string;
	author_elem.style.opacity = "0.0";
	quote_elem.style.visibility = "visible";
	author_elem.style.visibility = "visible";

	for (var i = 0; i < 1; i++) {
		quote_elem.innerText = quote_string.substring(0, quote_string.length - 1);
		await sleep(500);
		quote_elem.innerText = quote_string;
		await sleep(500);
	}

	var pause = true;

	for (letter in quote) {
		quote_string = quote_string.substring(0, quote_string.length - 1);
		quote_string = quote_string.concat(quote[letter], "_").toString()
		if (quote_string.includes("create") && pause) {
			for (var i = 0; i < 1; i++) {
				quote_elem.innerText = quote_string.substring(0, quote_string.length - 1);
				await sleep(500);
				quote_elem.innerText = quote_string;
				await sleep(500);
			}
			pause = false;
		}
		quote_elem.innerText = quote_string;
		await sleep(80);
	}

	for (var i = 0; i < 50; i++) {
		author_elem.style.opacity = parseFloat(author_elem.style.opacity) + i / 1000;
		await sleep(25);
	}

	while(true) {
		quote_elem.innerText = quote_string.substring(0, quote_string.length - 1);
		await sleep(500);
		quote_elem.innerText = quote_string;
		await sleep(500);
	}
}