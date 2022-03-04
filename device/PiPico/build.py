import os
pio = "C:\\Users\\Admin\\.platformio\\penv\\Scripts\\platformio.exe"
command = f"{pio}  run --environment pico"
print("Executing: " + command)
os.system(command)