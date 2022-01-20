import serial
ser = serial.Serial("COM3", 115200)
while True:
     cc=str(ser.readline())
     tr = ["b'", "\\r\\n'"]
     for i in tr: cc= cc.replace(i, "")
     
     print(cc)