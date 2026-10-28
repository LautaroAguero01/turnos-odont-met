import os
for d in ['openspec/changes/create-appointment-overlap-prevention/specs', 'openspec/changes/archive/2026-10-28-create-appointment-overlap-prevention/specs']:
    print(d)
    if os.path.exists(d):
        for f in os.listdir(d):
            fp = os.path.join(d, f)
            sz = os.path.getsize(fp)
            print('  ', f, sz, 'bytes')
    else:
        print('  NOT FOUND')
