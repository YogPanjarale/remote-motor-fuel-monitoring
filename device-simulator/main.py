from dataclasses import dataclass

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
    # Engine 
    rpm:int# Engine RPM (Just Pulse not actual rpm)
    temp1:int# Engine Temperature 1
    temp2:int# Engine Temperature 2
    temp3:int# Engine Temperature 3
    temp4:int# Engine Temperature 4
    lube_oil_pressure:int# Lube Oil Pressure
    # Water
    water_presence:bool# Water Presence
    water_flow_volume_rate_pulse:int# Water Flow Rate (Just Pulse not actual volume)
    # Fuel
    fuel_sensor_level:int# Fuel Sensor Level (Volume)
    #TODO(To be calculated server side) fuel_filled:int# Fuel Filled
    #TODO(To be calculated server side) fuel_drained:int# Fuel Filled
    # Engine Control
    engine_switch:int# Engine Switch (2,0,1) 1 = on, 0 = off, 2 = reset
    engine_status:int# Engine Status (0,1,2) 0 = stopped, 1 = running, 2 = idle
    
    minutes_elapsed:int=0# Minutes elapsed since the device started
    
    def run(self):
        self.minutes_elapsed += 1
        
device = Device(rpm=0, temp1=0, temp2=0, temp3=0, temp4=0, lube_oil_pressure=0)
print(device)