#include "Arduino.h"

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    int value = Serial.read();
    if (value == '1') {
      digitalWrite(13, HIGH);
    } else if (value == '0') {
      digitalWrite(13, LOW);
    }else {
      String str = "You Enterd : " + String(value);

      Serial.println(str.c_str());
    }
  }
}

