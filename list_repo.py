import os
for root, dirs, files in os.walk('.'):
    level = root.replace('.', '').count(os.sep)
    indent = ' ' * 2 * level
    dirs.sort()
    files.sort()
    print(f"{indent}{os.path.basename(root)}/")
    subindent = ' ' * 2 * (level + 1)
    for f in files:
        fp = os.path.join(root, f)
        sz = os.path.getsize(fp)
        print(f"{subindent}{f} ({sz} bytes)")
    if level > 3:
        del dirs[:]
