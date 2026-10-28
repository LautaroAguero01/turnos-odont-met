import PyPDF2, sys
pdf = r"D:\Descargas E\discovery.pdf"
with open(pdf, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
with open("discovery_externo.txt", "w", encoding="utf-8") as out:
    out.write(text)
print("Pages:", len(reader.pages))
print("Length:", len(text))
