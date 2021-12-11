#include "Arduino.h"
#include "ArduinoJson.h"
void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
    DynamicJsonDocument doc(1024);
  if (Serial.available() > 0) {
    String input = Serial.readString();
    deserializeJson(doc, input);
    Serial.println("You said : " + input);
    if (doc["command"] == "on") {
      digitalWrite(13, HIGH);
    } else if (doc["command"] == "off") {
      digitalWrite(13, LOW);
    }
  }
}

