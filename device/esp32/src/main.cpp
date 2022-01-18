
#include <Arduino.h>
#include "EspMQTTClient.h"
#include <GyverMAX6675_SPI.h>
#include <ArduinoJson.h>
#include "properties.h"

String DeviceID = DeviceID;

EspMQTTClient client(WIFI_SSID, WIFI_PASSWORD, MQTT_SERVER_IP, MQTT_USERNAME, MQTT_PASSWORD, MQTT_CLIENT_NAME, MQTT_SERVER_PORT);

// Engine Stuff
GyverMAX6675_SPI<10> temp1;
GyverMAX6675_SPI<11> temp2;
GyverMAX6675_SPI<12> temp3;
GyverMAX6675_SPI<13> temp4;

const byte engineRPM_pin = 14;

const byte engineRelay_pin = 15;
struct EngineData
{
  short int temp1 = 0;
  short int temp2 = 0;
  short int temp3 = 0;
  short int temp4 = 0;
  short int rpm = 0;
  boolean status = false;
};

struct EngineData engineData;
void readEngineData()
{
  engineData.temp1 = temp1.getTempInt();
  engineData.temp2 = temp2.getTempInt();
  engineData.temp3 = temp3.getTempInt();
  engineData.temp4 = temp4.getTempInt();
  // calculating rpm
  const int onesecond = 1000 * 1000; // second in microseconds
  const int duration = pulseIn(engineRPM_pin, HIGH, onesecond * 5);
  engineData.rpm = (duration / onesecond) * 60;
  engineData.status = digitalRead(engineRelay_pin);
}

// Water Pump Stuff
const byte waterPresence_pin = 16;
const byte waterFlowRate_pin = 17;

struct WaterData
{
  boolean presence = false;
  short int flowRate = 0;
};

WaterData waterData;
void readWaterData()
{
  waterData.presence = digitalRead(waterPresence_pin);
  const int duration = pulseIn(waterFlowRate_pin, HIGH, 1000 * 1000);
  waterData.flowRate = (duration / 1000 * 1000) * 60;
}

// Fuel Stuff
const byte fuelSensor_pin = 18;

short int fuelSensorReading = 0;

void readFuelData()
{
  fuelSensorReading = analogRead(fuelSensor_pin);
}

//read all data task
void readAllData(void *pvParameters)
{
  while (1)
  {
    readEngineData();
    readWaterData();
    readFuelData();
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}


// publish data
void publishmqtt()
{
  DynamicJsonDocument doc(1024);
  doc["engine"]["temp1"] = engineData.temp1;
  doc["engine"]["temp2"] = engineData.temp2;
  doc["engine"]["temp3"] = engineData.temp3;
  doc["engine"]["temp4"] = engineData.temp4;
  doc["engine"]["rpm"] = engineData.rpm;
  doc["engine"]["status"] = engineData.status;

  doc["water"]["presence"] = waterData.presence;
  doc["water"]["flowRate"] = waterData.flowRate;

  doc["fuel"]["reading"] = fuelSensorReading;

  String json;
  serializeJson(doc, json);
  client.publish(DeviceID, json);

}

void publishmqtt_loop(void *pvParameters)
{
  while (1)
  {
    publishmqtt();
    vTaskDelay(5000 / portTICK_PERIOD_MS);
  }
}

//mqtt task
void mqtt_task(void *pvParameters)
{
  while (1)
  {
  client.loop();
  vTaskDelay(100 / portTICK_PERIOD_MS);
  }
  
}
void setup()
{
  Serial.begin(115200);
  client.enableDebuggingMessages(); // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater();
  client.enableOTA();                                                     // Enable OTA (Over The Air) updates. Password defaults to MQTTPassword. Port is the default OTA port. Can be overridden with enableOTA("password", port).
  String lastWillTopic = DeviceID + String("/last");                      // Last will topic
  client.enableLastWillMessage(lastWillTopic.c_str(), "unexpected exit"); // You can activate the retain flag by setting the third parameter to true
  xTaskCreate(
      readAllData,
      "readAllData",
      10000,
      NULL,
      1,
      NULL);
  xTaskCreate(
    publishmqtt_loop,
    "publishmqtt_loop",
    10000,
    NULL,
    1,
    NULL);
  xTaskCreate(
    mqtt_task,
    "mqtt_task",
    10000,
    NULL,
    1,
    NULL);
  
}

// This function is called once everything is connected (Wifi and MQTT)
void onConnectionEstablished()
{
  client.subscribe(DeviceID + String("/test"), [](const String &payload)
                   { Serial.println(payload); });

  client.subscribe(DeviceID + String("/wildcardtest/#"), [](const String &topic, const String &payload)
                   { Serial.println("(From wildcard) topic: " + topic + ", payload: " + payload); });
  client.publish(DeviceID + String("/test"), "This is a message");
}


void loop()
{
}