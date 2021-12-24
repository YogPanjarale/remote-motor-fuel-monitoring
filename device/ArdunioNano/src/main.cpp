#include "Arduino.h"
#include "ArduinoJson.h"
#include "max6675.h"
#include "SPI.h"
const int spi_miso_pin = 12;// SPI master in slave out pin
const int spi_sck_pin = 13;//SPI serial clock pin
const byte max6675_num = 4;// the number of max6675s modules connected
const int max6675_cs_pins[max6675_num] = //max6675 chip select pins 
{
  10,
  9,
  8,
  7,
};

MAX6675 max6675s[max6675_num] = 
{
  MAX6675(spi_miso_pin, spi_sck_pin, max6675_cs_pins[0]),
  MAX6675(spi_miso_pin, spi_sck_pin, max6675_cs_pins[1]),
  MAX6675(spi_miso_pin, spi_sck_pin, max6675_cs_pins[2]),
  MAX6675(spi_miso_pin, spi_sck_pin, max6675_cs_pins[3])
};

const int water_presence_pin = 2;// water presence pin
const int fuel_level_pin = A0;// fuel level pin

struct Engine
{
  bool water_presence;// water presence
  int engine_temp1;// engine temperature 1
  int engine_temp2;// engine temperature 2
  int engine_temp3;// engine temperature 3
  int engine_temp4;// engine temperature 4
  int fuel_sensor;// fuel sensor
  // to doc
  DynamicJsonDocument toDoc(){
    DynamicJsonDocument doc = DynamicJsonDocument(1024);
    doc["water_presence"] = water_presence;
    doc["engine_temp1"] = engine_temp1;
    doc["engine_temp2"] = engine_temp2;
    doc["engine_temp3"] = engine_temp3;
    doc["engine_temp4"] = engine_temp4;
    doc["fuel_sensor"] = fuel_sensor;
    return doc;
  };
};


void setup() {
  Serial.begin(9600);
  pinMode(water_presence_pin,INPUT);
  pinMode(fuel_level_pin,INPUT);
  // pinMode(13, OUTPUT);
}
void read_water_presence(Engine &engine)
{
  engine.water_presence = digitalRead(water_presence_pin);
}
void read_engine_temp(Engine &engine)
{
  engine.engine_temp1 = max6675s[0].readCelsius();
  engine.engine_temp2 = max6675s[1].readCelsius();
  engine.engine_temp3 = max6675s[2].readCelsius();
  engine.engine_temp4 = max6675s[3].readCelsius();
}
void read_fuel_sensor(Engine &engine)
{
  int sensorVal = analogRead(fuel_level_pin);
  float voltage = sensorVal * (500 / 1023.0);
  engine.fuel_sensor = voltage;
}

void loop() {
  Engine engine;
  read_water_presence(engine);
  read_engine_temp(engine);
  read_fuel_sensor(engine);
  // Serial.println(engine.toDoc().as<char*>());
  // Serial.println(engine.toDoc().as<String>());
 DynamicJsonDocument inp(1024);
  if (Serial.available()>0){
    String input = Serial.readString();
    deserializeJson(inp, input);
    if (inp["command"] =="send all"){
      serializeJson(engine.toDoc(), Serial);
      digitalWrite(13, HIGH);
    }
  }
    delay(1000);
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