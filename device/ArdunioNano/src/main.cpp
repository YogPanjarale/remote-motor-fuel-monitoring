// Reading Temperature (Connect to SPI)
#include <GyverMAX6675_SPI.h>

// Before connecting the library you can
// Set SPI speed in Hz (silent. 1000000 - 1 MHz)
// To increase the Quality of Long Wire Communications
// # DEFINE MAX6675_SPI_SPEED 300000

// Indicate PIN. CS
// The rest are connected to the hardware SPI (SCK и MISO)
GyverMAX6675_SPI<10> sensor1;
GyverMAX6675_SPI<9> sensor2;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if (sensor1.readTemp()) {            // We read the temperature
    Serial.print("[s1] Temp: ");         // If reading has passed successfully - we take inSerial
    Serial.print(sensor1.getTemp());   //takeTheTemperatureThroughGetTemp
    //Serial.print(sens.getTempInt());   // or getTempInt -integers (without Float)
    Serial.println(" °C");
  } else Serial.println("[s1] Error");   //Reading or Connection Error - Display log
  if (sensor2.readTemp()) {            // We read the temperature
    Serial.print("[s2] Temp: ");         // If reading has passed successfully - we take inSerial
    Serial.print(sensor2.getTemp());   //takeTheTemperatureThroughGetTemp
    //Serial.print(sens.getTempInt());   // or getTempInt -integers (without Float)
    Serial.println(" °C");
  } else Serial.println("[s2] Error");   //Reading or Connection Error - Display log

  delay(1000);                      // A little wait
}