
#include <Arduino.h>
#include "EspMQTTClient.h"
#include <GyverMAX6675_SPI.h>
#include <SSD1306Wire.h>
#include <ArduinoJson.h>
#include "properties.h"

String DeviceID = DeviceID;

EspMQTTClient client(WIFI_SSID, WIFI_PASSWORD, MQTT_SERVER_IP, MQTT_USERNAME, MQTT_PASSWORD, MQTT_CLIENT_NAME, MQTT_SERVER_PORT);

// Engine Stuff
GyverMAX6675_SPI<14> temp1;
GyverMAX6675_SPI<15> temp2;
GyverMAX6675_SPI<16> temp3;
GyverMAX6675_SPI<17> temp4;

const byte engineRPM_pin = 18;

const byte engineRelay_pin = 19;
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
const byte waterPresence_pin = 20;
const byte waterFlowRate_pin = 32;

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
const byte fuelSensor_pin = 33;

short int fuelSensorReading = 0;

void readFuelData()
{
  fuelSensorReading = analogRead(fuelSensor_pin);
}

void setupPinModes(){
  pinMode(engineRPM_pin, INPUT);//18
  pinMode(engineRelay_pin, OUTPUT);//19
  pinMode(waterPresence_pin, INPUT);//20
  pinMode(waterFlowRate_pin, INPUT);//32
  pinMode(fuelSensor_pin, INPUT);//33
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

void onEngineSwitch(String payload)
{
  if (payload == "true")
  {
    digitalWrite(engineRelay_pin, HIGH);
  }
  else
  {
    digitalWrite(engineRelay_pin, LOW);
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

  // print("Publishing...");
  String json;
  serializeJson(doc, json);
  String topic =MQTT_ROOT;
  topic += "/" + DeviceID;
  topic += "/data";
  client.publish(topic, json);

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
  client.enableOTA();
  char topic[100];
  sprintf(topic,"%s/%s/logs",MQTT_ROOT,DeviceID.c_str());// Last will topic
  const char *lastWillTopicc = topic;
  client.enableLastWillMessage(lastWillTopicc, "unexpected disconnect"); // You can activate the retain flag by setting the third parameter to true
  setupPinModes();
  // display.init();
  // display.flipScreenVertically();
  // display.setFont(ArialMT_Plain_10);

  // print("Starting...");
  // xTaskCreate(readAllData,"readAllData",1000,NULL,1,NULL);
  // xTaskCreate(publishmqtt_loop,"publishmqtt_loop",1000,NULL,1,NULL);
  // xTaskCreate(mqtt_task,"mqtt_task",5000,NULL,1,NULL);
  
}

// This function is called once everything is connected (Wifi and MQTT)
void onConnectionEstablished()
{ 
  // print("MQTT Connected");
  String topic = MQTT_ROOT;
  topic += "/" + DeviceID;
  client.publish(topic+"/logs", "connected");
  client.subscribe(topic+"/switch",onEngineSwitch);

}


long lastPublished = 0;
void loop()
{
  readAllData(NULL);
  if (millis() - lastPublished > 5000)
  {
    publishmqtt();
    lastPublished = millis();
  }
  client.loop();
  delay(50);
}