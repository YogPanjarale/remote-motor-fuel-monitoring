#include "Arduino.h"
#include "ArduinoJson.h"
const byte no_of_temp = 4;          // the number of engine temperature sensors connected
const int tempSensors[no_of_temp] = {10,9,8,7};// Engine temperature sensor pins
const int water_presence_pin = 2; // water presence pin
const int fuel_level_pin = A0;    // fuel level pin
const int engineRpmPulsePin = 6;  // engine rpm pulse pin
const int waterFlowPulsePin = 5;  // water flow pulse pin
const int waterPresencePin = 11; // water presence pulse pin

struct Engine
{
  bool water_presence; // water presence
  int engine_temp1;    // engine temperature 1
  int engine_temp2;    // engine temperature 2
  int engine_temp3;    // engine temperature 3
  int engine_temp4;    // engine temperature 4
  int fuel_sensor;     // fuel sensor
  // to doc
  DynamicJsonDocument toDoc()
  {
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

void setTempSensorPinMode()
{
  for (int i = 0; i < no_of_temp; i++)
  {
    pinMode(tempSensors[i], INPUT);
  }
}

void setup()
{
  Serial.begin(9600);
  pinMode(water_presence_pin, INPUT);
  pinMode(fuel_level_pin, INPUT);
  // pinMode(13, OUTPUT);
}
void read_water_presence(Engine &engine)
{
  engine.water_presence = digitalRead(water_presence_pin);
}
void read_engine_temp(Engine &engine)
{
  engine.engine_temp1 = digitalRead(tempSensors[0]);
  engine.engine_temp2 = digitalRead(tempSensors[1]);
  engine.engine_temp3 = digitalRead(tempSensors[2]);
  engine.engine_temp4 = digitalRead(tempSensors[3]);
}
void read_fuel_sensor(Engine &engine)
{
  int sensorVal = analogRead(fuel_level_pin);
  float voltage = sensorVal * (500 / 1023.0);
  engine.fuel_sensor = voltage;
}

void loop()
{
  Engine engine;
  read_water_presence(engine);
  read_engine_temp(engine);
  read_fuel_sensor(engine);
  Serial.println(engine.toDoc().as<String>());
  delay(1000);
}