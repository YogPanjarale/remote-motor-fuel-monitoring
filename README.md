# remote water pump management system

## Tasks

Engine

- [ ] engine temperature sensors x3 + vacuum pump temp x1  (SPI) x4
- [ ] engine RPM (pulse) x1
- [ ] engine running hours (counter)

Fuel

- [ ] fuel pump sensor (ADC) x1
- [ ] fuel volume <10% (alert)
- [ ] fuel filling quantity (counter)
- [ ] fuel draining quantity (counter)

Water

- [ ] water presence sensor (INPUT) x1
- [ ] No Water flow / dry run (boolean)
- [ ] water flow rate sensor (pulse/RS485) x1
- [ ] water flow volume (counter)

Control

- [ ] Engine On & Off (boolean)
- [ ] Self engine off , dry run > user defined time
- [ ] Self engine off , low fuel
- [ ] Self Engine OFF, Engine operated more than a limit
- [ ] Self Engine OFF , Engine temp critical high

## Device

for device part we need to

Engine-

- [ ] read & send 4 temp sensors value through mqtt
`SPI sensors`
- [ ] measure & send Engine RPM value through mqtt
`pulse input`

Fuel-

- [ ] read & send fuel sensor reading value through mqtt
`ADC input`

Water-

- [ ] read & send water presence sensor value through mqtt
`digital INPUT input`
- [ ] measure & send water flow sensor reading value through mqtt
`pulse input`

Control-

- [ ] capture & action upon receiving commands for engine on/off from mqtt
