import PyPDF2, sys
with open('docs/discovery/informe-discovery.pdf','rb') as f:
    r = PyPDF2.PdfReader(f)
    pages = len(r.pages)
    text = ''
    for p in r.pages:
        text += p.extract_text() or ''
    with open('docs/discovery/evidence/new_pdf_text.txt','w',encoding='utf-8') as out:
        out.write(text)
    print('Pages:', pages)
    print('Chars:', len(text))
