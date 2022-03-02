#include <Arduino.h>
#include <Wire.h> 

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
GyverMAX6675_SPI<8> sensor3;
GyverMAX6675_SPI<7> sensor4;

uint8_t water_presence_sensor = DD6;

int s1,s2,s3,s4,wp;
void request_temp() {
  s1 = sensor1.getTempInt();
  s2 = sensor2.getTempInt();
  s3 = sensor3.getTempInt();
  s4 = sensor4.getTempInt();
  wp = !digitalRead(water_presence_sensor);
}
void request_temp_loop() {
  request_temp();
  String c = ",";
  Serial.println(s1+c+s2+c+s3+c+s4+c+wp);
}
void requestEvent() {
  Serial.println("Request");
  request_temp_loop();
  static short int i = 0;
  if (i++ >= 5) {
    i = 0;
  }
  int arr[] = {255,s1,s2,s3,s4,wp};
  Wire.write(arr[i]);

}
void setup() {
  //pin mode
  pinMode(water_presence_sensor, INPUT_PULLUP);
  Wire.begin(2);
  Wire.onRequest(requestEvent);
  Serial.begin(9600);
  Serial.println("Nano Start");
}
void loop() {
  // request_temp_loop();
  delay(1000);
}