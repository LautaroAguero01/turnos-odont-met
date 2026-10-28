import PyPDF2, sys
pdf_path = "desarrollo-active-stack.pdf"
with open(pdf_path, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
with open("desarrollo-active-stack.txt", "w", encoding="utf-8") as out:
    out.write(text)
print("Pages:", len(reader.pages))
print("Extracted length:", len(text))
