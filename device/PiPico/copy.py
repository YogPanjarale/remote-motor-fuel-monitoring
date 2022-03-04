import shutil
import os
is_main = __name__ == "__main__"
pwd = os.getcwd()
build_path =  '/.pio/build/pico/firmware.uf2'

if os.path.exists(pwd + build_path):
    print("Found firmware.uf2")
else:
    print('No firmware found. Please build firmware first.')
    exit(1)
print()
info_path_base = "/INFO_UF2.TXT"
device_drive = ""
possible_drives = ['E:','I:', 'J:', 'K:', 'L:', 'M:', 'N:', 'O:', 'P:', 'Q:', 'R:', 'S:', 'T:', 'U:', 'V:', 'W:', 'X:', 'Y:', 'Z:']
# cheak if info file exists
for i in possible_drives:
    info_path = i + info_path_base
    if os.path.exists(info_path):
        with open(info_path, 'r') as f:
            info = f.read()
            print(f"Found Device on {i}")
            print(info)
            f.close()
            device_drive = i
if not device_drive:
    print('No device found. Please connect device first.')
    print('-'*16)
    print('- If you have connected the device reconnect it while holding the bootselect button.')
    print("- If you don't have a device connected, please connect it and then run this script again.")
    exit(1)
    
print("Uploading firmware.uf2 to device...")
origin = pwd + build_path
target = "I:/firmware.uf2"
try:
    shutil.copy2(origin, target)
    if is_main:
        print("Upload successful.")
        exit(0)
except Exception as e:
    print(e)
    print("Upload failed.")
    exit(1)
    
    
# shutil.copy2(pwd + '/.pio', pwd + '/upload.py.bkup')
#
# print(pwd)