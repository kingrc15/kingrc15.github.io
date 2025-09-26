---
title: "Research"
permalink: /research/
author_profile: true
layout: single
---

My research focuses on developing multimodal foundation models for healthcare applications, with particular emphasis on contrastive pretraining, transfer learning, and continual learning for Electronic Health Records (EHR) data.

## Research Highlights

### Multimodal Pretraining for Healthcare
- **Developed the first bi-modal pretraining method** for EHR time-series data and clinical notes, utilizing contrastive pretraining and masked reconstruction
- **Created zero-shot evaluation frameworks** demonstrating that pretrained models outperform fully fine-tuned models without labeled data
- **Currently developing unified training objectives** for multi-modal contrastive pretraining across different data modalities

### Transfer Learning and Model Transportability
- **Developed EHR benchmarks** to evaluate model transferability from large academic hospitals to various regions across the U.S.
- **Working on lifelong learning approaches** for transferring pretrained models to institutions with different demographics
- **Created domain incremental continual learning benchmarks** for ICU time series model transportability

### Foundation Models for Healthcare
- **Memory-efficient continual learning** with CLIP models for healthcare applications
- **Privacy-preserving continual learning** for EHRs using bimodal contrastive pretraining
- **Guideline-aware, language-conditioned time-series models** for lab abnormality prediction

## Publications

### 2024
**Memory-Efficient Continual Learning with CLIP Models**  
*Ryan King*, Gang Li, Bobak J. Mortazavi, Tianbao Yang  
NeurIPS 2024 Workshop on Adaptive Foundation Models

**An Efficient Contrastive Unimodal Pretraining Method for EHR Time Series Data**  
*Ryan King*, Shivesh Kodali, Conrad Kreuger, Tianbao Yang, Bobak Mortazavi  
2024 IEEE EMBS International Conference on Biomedical and Health Informatics (BHI)  
*Acceptance Rate: 25.6%*

**A Domain Incremental Continual Learning Benchmark for ICU Time Series Model Transportability**  
*Ryan King*, Conrad Kreuger, Ethan Vesekla, Tianbao Yang, Bobak Mortazavi  
2024 IEEE EMBS International Conference on Biomedical and Health Informatics (BHI)  
*Acceptance Rate: 25.6%*

### 2023
**Multimodal Pretraining of Medical Time Series and Notes**  
*Ryan King*, Tianbao Yang, Bobak Mortazavi  
Proceedings of the 3rd Machine Learning for Health Symposium (ML4H), PMLR 225:244-255  
*Acceptance Rate: 28.7%*

### Collaborative Work
**MEDS Decentralized, Extensible Validation (MEDS-DEV) Benchmark: Establishing Reproducibility and Comparability in ML for Health**  
Matthew B.A. McDermott, Aleksia Kolo, Chao Pang, Edward Choi, Ethan Steinberg, Hyewon Jeong, Jack Gallifant, Jason Alan Fries, Jeffrey N Chiang, Jungwoo Oh, Justin Xu, Kamilė Stankevičiūtė, Kiril Vadimovic Klein, Mikkel Fruelund Odgaard, Nassim Oufattole, Patrick Rockenschaub, Pawel Renc, Robin van de Water, Shalmali Joshi, Simon Austin Lee, Teya Bergamaschi, Tom Pollard, Vincent Jeanselme, Nigam Shah, Michael Wornow, Aparajita Kashyap, Xinzhou Jiang, Yanwei Li, Young Sang Choi, Yuta Kobayashi, *Ryan King*  
Proceedings of the 4th Machine Learning for Health Symposium (ML4H)

### Under Review
**Guideline-Aware, Language-Conditioned Time-Series Model for Lab Abnormality Prediction in EHRs**  
*Ryan King*, Julian Samuel, Sadeer Al-Kindi, Bobak Mortazavi  
Proceedings of the 5th Machine Learning for Health Symposium (ML4H)

**Privacy Preserving Continual Learning for EHRs using Bimodal Contrastive Pretraining**  
Barry Liu, *Ryan King*, Tianbao Yang, Bobak Mortazavi  
Proceedings of the 5th Machine Learning for Health Symposium (ML4H)

## Research Projects

### Current Projects
1. **Bi-modal Pretraining for EHR Data**: Developing methods to unify EHR time-series data and clinical notes using contrastive pretraining and masked reconstruction
2. **Transfer Learning Benchmarks**: Creating comprehensive benchmarks for evaluating model transferability across healthcare institutions
3. **Continual Learning for Healthcare**: Developing lifelong learning approaches for evolving healthcare data and changing demographics
4. **Multi-modal Foundation Models**: Creating unified training objectives for contrastive pretraining across multiple healthcare data modalities

### Past Projects
1. **Domain Adaptation for scRNA-seq**: Developed Maximum Mean Discrepancy minimization techniques for batch correction in single-cell RNA sequencing data
2. **Deep Generative Models**: Ported TensorFlow Zero-Inflated Negative Binomial Autoencoders to PyTorch for improved usability and training stability

## Research Environment

I work in the **Clinical AI Lab** at Texas A&M University under the supervision of Dr. Bobak Mortazavi and Dr. Tianbao Yang. Our lab maintains two high-performance compute servers and has developed comprehensive onboarding infrastructure for new researchers.

### Lab Infrastructure
- **High-performance compute servers** for large-scale model training
- **Comprehensive setup guides** for new student onboarding
- **Open-source tools** for reproducible research across institutions

## Open Source Contributions

### Healthcare ML Tools
- **[torchmimic](https://torchmimic.readthedocs.io/en/latest/)**: PyTorch-based EHR toolkit for reproducible research
- **[meds-transforms](https://github.com/Oufattole/meds-torch/tree/main)**: Clinical data preprocessing utilities
- **[meds-transforms](https://github.com/mmcdermott/MEDS_transforms)**: Additional preprocessing tools for clinical data

### Documentation & Guides
- **[New Student Setup Guide](https://kingrc15.github.io/setup/new-student-setup/)**: Comprehensive onboarding documentation for new lab members
- **Kaggle Tutorials**: Clinical competition development tutorials

## Research Philosophy

My research is driven by the belief that foundation models can revolutionize healthcare by enabling:
- **Generalizable AI systems** that work across different institutions and patient populations
- **Privacy-preserving methods** that protect patient data while enabling collaborative research
- **Continual learning systems** that adapt to evolving healthcare practices and demographics
- **Multimodal approaches** that leverage the full spectrum of healthcare data

## Collaboration

I'm always interested in collaborating with researchers working on:
- Healthcare AI and machine learning
- Multimodal learning and foundation models
- Transfer learning and domain adaptation
- Continual learning and lifelong learning
- Clinical data analysis and EHR systems

Feel free to reach out if you're interested in collaborating or have questions about my research!
