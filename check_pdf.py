with open('discovery_pdf_text.txt','r',encoding='utf-8') as f:
    text = f.read()
keywords = ['A.1','A.2','A.3','A.4','A.5','B. Matriz','C.1','C.2','C.3','C.4','D.1','D.2','D.3','E. ','F. Fuentes','G. Verific','Lista de espera','11 puntos','MVP sugerido','Resumen ejecutivo','Analisis competitivo']
for k in keywords:
    count = text.count(k)
    lines = text.splitlines()
    first_line = None
    for i,line in enumerate(lines):
        if k in line:
            first_line = i+1
            break
    print(f"{k!r}: count={count}, first_line={first_line}")
print('Total chars:', len(text))
for sec in ['A. Tabla comparativa','B. Matriz de puntuacion','C. Analisis competitivo','D. Recomendacion final','E. Los 11 puntos','F. Fuentes principales','G. Verificacion de fuentes']:
    print(sec, '=>', sec in text)
