"""Verify an optimized Glimbraid APK; run from the project root."""
from pathlib import Path
import argparse, re, subprocess, tempfile, zipfile
parser=argparse.ArgumentParser()
parser.add_argument('apk');parser.add_argument('--build-tools',required=True);parser.add_argument('--mapping',default='android/app/build/outputs/mapping/release/mapping.txt')
parser.add_argument('--target-sdk',default='36');parser.add_argument('--version-code',default='18');parser.add_argument('--version-name',default='0.1.0-test18');parser.add_argument('--certificate-sha256',default='ef2680ca70257beece62ab785e39c454e8f5f20db21c8330c1165736baee67b0')
a=parser.parse_args();apk=Path(a.apk).resolve();tools=Path(a.build_tools)
badging=subprocess.check_output([str(tools/'aapt'),'dump','badging',str(apk)],text=True)
assert "name='no.bjerkholtstudio.sporlys'" in badging
assert f"versionCode='{a.version_code}'" in badging and f"versionName='{a.version_name}'" in badging
assert 'application-debuggable' not in badging
assert "name='com.android.vending.BILLING'" in badging
assert "sdkVersion:'24'" in badging
assert f"targetSdkVersion:'{a.target_sdk}'" in badging, 'Unexpected target API level'
signature=subprocess.check_output(['java','-jar',str(tools/'lib/apksigner.jar'),'verify','--print-certs',str(apk)],text=True)
assert a.certificate_sha256.lower().replace(':','') in signature
assert Path('dist').is_dir(),'Run from the Glimbraid project root'
with zipfile.ZipFile(apk) as z:
    for p in Path('dist').rglob('*'):
        if p.is_file():assert z.read('assets/public/'+p.relative_to('dist').as_posix())==p.read_bytes(),str(p)
    dex=[i for i in z.infolist() if re.fullmatch(r'classes[0-9]*\.dex',i.filename)]
    assert dex
    with tempfile.TemporaryDirectory() as tmp:
        output=''
        for i in dex:
            p=Path(tmp)/i.filename;p.write_bytes(z.read(i))
            output+=subprocess.check_output([str(tools/'dexdump'),'-d',str(p)],text=True,errors='replace')
        for name in ['GlimbraidBillingStatePlugin','PurchasePlugin','glimbraid_full_game','SporlysFilesPlugin','shareImage','saveImage','saveBackup','imageSaved','backupSaved','androidx/core/content/FileProvider']:
            assert name in output,'R8 removed '+name
    mapping=Path(a.mapping).read_text()
    bridge=re.search(r'^com\.getcapacitor\.Bridge -> ([^:]+):',mapping,re.M)[1]
    assert 'L'+bridge.replace('.', '/')+';' in output,'Mapped Capacitor bridge absent'
    print('PASS: release identity, expected signature, Android 7 support, all web assets and native bridge/export callbacks retained.')
    print('Uncompressed DEX bytes:',sum(i.file_size for i in dex))
