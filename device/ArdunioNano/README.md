# Arduino Nano I²C slave to take input Sensor data

## Wiring

- SCK Serial Clock (SCK) - pin 13
- MISO Master In Slave Out (MISO) - pin 12
- TEMP Sensor 1 CS CHip Select (CS) - pin 10
- TEMP Sensor 2 CS CHip Select (CS) - pin 9
- TEMP Sensor 3 CS CHip Select (CS) - pin 8
- TEMP Sensor 4 CS CHip Select (CS) - pin 7
- Water presence (Water) - pin 6

## Functions

1. Read Temperature from Thermocouples 1,2,3,4

2. Water Presence (digital)

[TODO] 3. Read Fuel Sensor value (analog)

## Send data to master  (I²C)

Data Format:
| No. | Data(byte) | Description   |   |   |
|-----|------------|---------------|---|---|
| 0   | 255        | Header        |   |   |
| 1   | 0-254      | temp sensor 1 |   |   |
| 2   | 0-254      | temp sensor 2 |   |   |
| 3   | 0-254      | temp sensor 3 |   |   |
| 4   | 0-254      | temp sensor 4 |   |   |
| 5   | 0-1      | Water presense|   |   |
