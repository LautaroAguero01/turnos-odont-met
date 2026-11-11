from weasyprint import HTML
HTML('docs/discovery/informe-discovery.md').write_pdf('docs/discovery/informe-discovery.pdf')
print('PDF regenerado: docs/discovery/informe-discovery.pdf')
