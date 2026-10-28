import os
exclude = {'node_modules', '.git', '.opencode'}
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in exclude]
    level = root.replace('.', '').count(os.sep)
    indent = '  ' * level
    basename = os.path.basename(root)
    if basename != '.' or level > 0:
        print(f"{indent}{basename}/")
    subindent = '  ' * (level + 1)
    for f in sorted(files):
        fp = os.path.join(root, f)
        sz = os.path.getsize(fp)
        print(f"{subindent}{f} ({sz})")
    if level > 3:
        dirs[:] = []
