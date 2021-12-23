#include "Arduino.h"
#include "ArduinoJson.h"
#include "max6675.h"
#include "SPI.h"
const int spi_miso_pin = 12;// SPI master in slave out pin
const int spi_sck_pin = 13;//SPI serial clock pin
const byte max6675_num = 1;// the number of max6675s modules connected
const int max6675_cs_pins[max6675_num] = //max6675 chip select pins 
{
  10
};

MAX6675 max6675s[max6675_num] = 
{
  MAX6675(spi_miso_pin, spi_sck_pin, max6675_cs_pins[0])
};

void setup() {
  Serial.begin(9600);
  // pinMode(13, OUTPUT);
}
void readVoltage();
// DynamicJsonDocument doc(1024);
void loop() {
   readVoltage();
    delay(1000);
}

void readVoltage()
{
  for (int i = 0; i < max6675_num; i++)
  {
    Serial.print("max6675 ");
    Serial.print(i);
    Serial.print(": ");
    Serial.print(max6675s[i].());
    Serial.println(" C");
  }
}

/*
 DynamicJsonDocument inp(1024);
  if (Serial.available() > 0) {
    String input = Serial.readString();
    deserializeJson(inp, input);
    Serial.println("You said : " + input);
    if (inp["command"] == "on") {
      digitalWrite(13, HIGH);
    } else if (inp["command"] == "off") {
      digitalWrite(13, LOW);
    }
  }*/