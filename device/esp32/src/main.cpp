#include "EspMQTTClient.h"
#include "properties.h"
#include <GyverMAX6675.h>

EspMQTTClient client(
    "PANJARALE_HOSPITAL",
    "12031975",
    "do1.yogpanjarale.com", // MQTT Broker server ip
    "esp0x001",             // MQTT USERNAME
    "Pleaseno",             // MQTT USERNAME
    "wifi-esp-0x001"        // MQTT Client Id
);

// Temp sensors
#define CLK 18
#define SO 19

GyverMAX6675<CLK, SO, 27> temp1;
GyverMAX6675<CLK, SO, 26> temp2;
GyverMAX6675<CLK, SO, 25> temp3;
GyverMAX6675<CLK, SO, 33> temp4;

byte engineRPMpin = 32;
// fuel sensor
byte fuelSensorADC = 35;
// water
byte waterPresence = 34;

void setup()
{
  Serial.begin(115200);

  // Optional functionalities of EspMQTTClient
  client.enableDebuggingMessages();                                      // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater();                                         // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overridded with enableHTTPWebUpdater("user", "password").
  client.enableOTA();                                                    // Enable OTA (Over The Air) updates. Password defaults to MQTTPassword. Port is the default OTA port. Can be overridden with enableOTA("password", port).
  client.enableLastWillMessage("devices/0x001/status", "offline", true); // You can activate the retain flag by setting the third parameter to true
  client.setKeepAlive(10);

  // setup pin modes
  pinMode(engineRPMpin, INPUT);
}

// This function is called once everything is connected (Wifi and MQTT)
void onConnectionEstablished()
{
  String base = "devices/0x001";
  // Subscribe to "mytopic/test" and display received message to Serial
  client.subscribe(base + "/engineSwitch", [](const String &payload)
                   { Serial.println(payload); });

  client.subscribe(base + "/update", [base](const String &payload)
                   {
    Serial.print("[Update]");
    Serial.println(payload);

    // temp sensors
    int t1 = temp1.getTemp();
    int t2 = temp2.getTemp();
    int t3 = temp3.getTemp();
    int t4 = temp4.getTemp();

    // engine rpm

    long duration_micro = pulseIn(engineRPMpin,digitalRead(engineRPMpin)==HIGH?LOW:HIGH,1*1000*1000);//read the time it takes (in microseconds) to be the inverse of current pin state with a timeout of 1 second 

    int timerrevCalc = duration_micro * 50.7801; //See above
    int rpm = 60000000/timerrevCalc; 
    char buffer[256];
    sprintf(buffer,"{'engine':{'temp1':%i,'temp2':%i,'temp3':%i,'temp4':%i,'rpm':%i}}",t1,t2,t3,t4,rpm);
    client.publish(base+"/data",buffer); 
  });
  client.subscribe(base + "/ping", [base](const String &payload)
  {
      Serial.println("[PING] : pong");
      client.publish(base+"/pong","pong"); 
  });
  client.publish(base + "/status", "online", true);
}

void loop()
{
  client.loop();
  
  delay(100);
}