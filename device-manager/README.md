# Device Manger

## Tasks

-[ ] have a list of online devices by reciving `/online` from the nroker
-[ ] send `base`+`update` mqtt message to device every `interval` seconds
-[ ] read to `base`+`data` mqtt message from device & update it to influxdb & other database
-[ ] calculate fuel level with calibration table
-[ ] check for the conditions like `low_fuel`, `high_temperature`, `high_running_hours`,`dry run`
-[ ] send notification  if any of the conditions are met
