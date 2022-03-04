#include <Arduino.h>
#include <Wire.h>

void requestEvent();
void setup() {
  Serial.begin(9600);
  Wire.begin(0x02);
  Serial.println("Started at address 0x02");
  Wire.onRequest(requestEvent);
}
int counter=0;
long last_time=0;
void loop() {
  if(millis()-last_time>1000){
    last_time=millis();
    counter++;
    Serial.print("Counter: ");
    Serial.println(counter);
  }
}
void requestEvent() {
  Wire.write(counter);
}