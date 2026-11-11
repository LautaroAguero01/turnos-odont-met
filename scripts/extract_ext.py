import PyPDF2, sys
pdf = "docs/discovery/informe-discovery.pdf"
with open(pdf, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
with open("docs/discovery/evidence/discovery_externo.txt", "w", encoding="utf-8") as out:
    out.write(text)
print("Pages:", len(reader.pages))
print("Length:", len(text))
