import pymupdf

def extract_text(pdf_bytes: bytes) -> str:
    doc = pymupdf.Document(stream=pdf_bytes, filetype="pdf")
    pages = []
    for page in doc:
        page_text = page.get_text().strip()
        if page_text:
            pages.append(page_text)
    # Join pages with form-feed character so simplifier can split per page
    return "\f".join(pages)
