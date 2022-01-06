from dataclasses import dataclass
from time import time
import paho.mqtt.client as mqtt
import json
import random
from utils import decrease, increase

@dataclass
class Device:
    '''# Remote Fuel Pump Device Simulator
        publishes sensor values to mqtt broker every 60 second
        ## Tasks
        1. Engine Sensors (rpm, temperature(1,2,3,4),lube oil pressure)
        2. Water Sensors (Presence, flow rate)
        3. Fuel Sensors (fuel level (volume) ,fuelFill, fuelDrain)
        4. Engine Control (start, stop, idle) & Engine Status (running, stopped, idle)
    '''
    device_id: str  # device id
    # Engine
    rpm: int  # Engine RPM (Just Pulse not actual rpm)
    temp1: int  # Engine Temperature 1
    temp2: int  # Engine Temperature 2
    temp3: int  # Engine Temperature 3
    temp4: int  # Engine Temperature 4
    lube_oil_pressure: int  # Lube Oil Pressure
    # Water
    water_presence: bool  # Water Presence
    # Water Flow Rate (Just Pulse not actual volume)
    water_flow_volume_rate_pulse: int
    # Fuel
    fuel_sensor_level: int  # Fuel Sensor Level (Volume)
    # TODO(To be calculated server side) fuel_filled:int# Fuel Filled
    # TODO(To be calculated server side) fuel_drained:int# Fuel Filled
    # Engine Control
    engine_switch: int  # Engine Switch (2,0,1) 1 = on, 0 = off, 2 = reset
    # Engine Status (0,1,2) 0 = stopped, 1 = running, 2 = idle
    engine_status: int

    minutes_elapsed: int = 0  # Minutes elapsed since the device started

    def run(self):
        self.minutes_elapsed += 1
        if self.engine_switch != self.engine_status:
            self.engine_status = self.engine_switch
        if self.engine_status == 1:
            self.rpm = increase(self.rpm, 5, 1800)
            self.temp1 = increase(self.temp1 +random.randint(-5,0),10, 170)
            self.temp2 = increase(self.temp2 +random.randint(-5,0),10, 170)
            self.temp3 = increase(self.temp3 +random.randint(-5,0),10, 170)
            self.temp4 = increase(self.temp4 +random.randint(-5,0),10, 170)
            self.lube_oil_pressure = increase(self.lube_oil_pressure + random.randint(-4,7), 10, 500)
            self.fuel_sensor_level = increase(self.fuel_sensor_level/2 + random.randint(-4,7), 10, 500)
        elif self.engine_status == 0:
            self.rpm = decrease(self.rpm, 5, 0)
            self.temp1 = decrease(self.temp1 +random.randint(0, 1),10, 20)
            self.temp2 = decrease(self.temp2 +random.randint(0, 1),10, 20)
            self.temp3 = decrease(self.temp3 +random.randint(0, 1),10, 20)
            self.temp4 = decrease(self.temp4 +random.randint(0, 1),10, 20)
            self.lube_oil_pressure = decrease(self.lube_oil_pressure, 15, 0)
    def to_json(self):
        doc = {
            "rpm": self.rpm,
            "temp1": self.temp1,
            "temp2": self.temp2,
            "temp3": self.temp3,
            "temp4": self.temp4,
            "lube_oil_pressure": self.lube_oil_pressure,
            "water_presence": self.water_presence,
            "water_flow_volume_rate_pulse": self.water_flow_volume_rate_pulse,
            "fuel_sensor_level": self.fuel_sensor_level,
            "engine_switch": self.engine_switch,
            "engine_status": self.engine_status
        }
        return json.dumps(doc)

device = Device(device_id="0x0001", rpm=0, temp1=0, temp2=0, temp3=0, temp4=0, lube_oil_pressure=0,
                water_presence=False, water_flow_volume_rate_pulse=0, fuel_sensor_level=0, engine_switch=0, engine_status=2)


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe(f"rfms/{device.device_id}/engine/control")
    client.publish(f"rfms/{device.device_id}/ping", "alive")


def on_messsage(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    if msg.topic == f"rfms/{device.device_id}/engine/control":
        if msg.payload == b"1":
            device.engine_switch = 1
        elif msg.payload == b"0":
            device.engine_switch = 0
        elif msg.payload == b"2":
            device.engine_switch = 2


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_messsage
client.username_pw_set("testrfms", "P@ssw0rd")
client.connect("do1.yogpanjarale.com", 1883,60 )

ts = time()
last = 0
# Run every 1 seconds
run_every = 1
while True:
    client.loop()
    t = round(time() - ts)
    if t%run_every == 0 and t != last:
        last = t
        device.run()
        doc = device.to_json()
        mqtt_topic = f"rfms/{device.device_id}/json"
        client.publish(mqtt_topic, doc)
    print(t,t%run_every==0)
    last = t
    
# print(device)
