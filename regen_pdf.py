from weasyprint import HTML
HTML('discovery/discovery.md').write_pdf('discovery/discovery.pdf')
print('PDF regenerado: discovery/discovery.pdf')
