#include "EspMQTTClient.h"
#include "properties.h"
#include <GyverMAX6675.h>

EspMQTTClient client(
  "PANJARALE_HOSPITAL",
  "12031975",
  "do1.yogpanjarale.com",  // MQTT Broker server ip
  "esp0x001",   // MQTT USERNAME
  "Pleaseno",   // MQTT USERNAME
  "wifi-esp-0x001"  // MQTT Client Id
);

//Temp sensors
#define CLK   14
#define SO 12

GyverMAX6675<CLK,SO,27> temp1;
GyverMAX6675<CLK,SO,26> temp2;
GyverMAX6675<CLK,SO,25> temp3;
GyverMAX6675<CLK,SO,33> temp4;





void setup()
{
  Serial.begin(115200);

  // Optional functionalities of EspMQTTClient
  client.enableDebuggingMessages(); // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater(); // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overridded with enableHTTPWebUpdater("user", "password").
  client.enableOTA(); // Enable OTA (Over The Air) updates. Password defaults to MQTTPassword. Port is the default OTA port. Can be overridden with enableOTA("password", port).
  client.enableLastWillMessage("devices/0x001/status", "offline");  // You can activate the retain flag by setting the third parameter to true
}

// This function is called once everything is connected (Wifi and MQTT)
void onConnectionEstablished()
{
String base =   "devices/0x001"
  // Subscribe to "mytopic/test" and display received message to Serial
  client.subscribe(base+"/engineSwitch", [](const String & payload) {
    Serial.println(payload);
  });
  
  client.subscribe(base+"/update",[](const String & payload){
    Serial.print("[Update]");
    Serial.println(payload);
    int t1 = temp1.getTemp();
    int t2 = temp2.getTemp();
    int t3 = temp3.getTemp();
    int t4 = temp4.getTemp();
    char[1024] buffer;    
    sprintf(buffer,"{'engine':{'temp1':%i,'temp2':%i,'temp3':%i,'temp4':%i}}",t1,t2,t3,t4);
    client.publish(base+"/data",buffer);
  });
 
  client.publish(base+"/status","online");
  }

void loop()
{
  client.loop();
  delay(100);
}