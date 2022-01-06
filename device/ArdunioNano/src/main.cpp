#include <Arduino.h>
#include <ArduinoJson.h>
#include "SPI.h"
// #include "millis_delay.h"
const byte max6675_num = 2;
const int max6675_cs_pin[max6675_num] = {10,9};

SPISettings max6675_spi(1000000, MSBFIRST, SPI_MODE1); //1mhz SPI clock

struct Data
{
  int temp_1;
  int temp_2;
};

int tempSensorsValues[max6675_num] = {0,0};
void spiSetup(){

  int i;
  for (i = 0; i < max6675_num; i++) {
    pinMode(max6675_cs_pin[i], OUTPUT);
    digitalWrite(max6675_cs_pin[i], HIGH);
  }
  SPI.begin();
  
}

void setup() {
  spiSetup();
  Serial.begin(9600);
  // give the MAX a little time to settle
  delay(500);
}
float max6675Read(int max6675_cs_pin){
  unsigned int data;
  SPI.beginTransaction(max6675_spi);
  digitalWrite(max6675_cs_pin, LOW);

  data = SPI.transfer16(0);

  digitalWrite(max6675_cs_pin, HIGH);
  SPI.endTransaction();
  if (data & 0x00004) {
    return NAN;
  }
  else{
    return (data >> 3) / 4;
  }
}
void readTemperatures() {
  const float mov_avg_alpha = 0.1;
  static float mov_avg[max6675_num] = {-100,-100};
  float value;
  int i;
  delay(220);

  for (i = 0; i < (int)max6675_num; i++)
  {
    value = max6675Read(max6675_cs_pin[i]);

    if (mov_avg[i]==-100) mov_avg[i] = value;

    mov_avg[i] = value * mov_avg_alpha +  mov_avg[i] * (1.0 - mov_avg_alpha);
    // Serial.print(round(mov_avg[i]));
    // Serial.print("\t");
    tempSensorsValues[i] = round(mov_avg[i]);
  }
  
  //TODO: read the temperatures from the MAX
}
void loop() {
  readTemperatures();
  //loop over tempSensorsValues and print them
  // int i;
  // for (i = 0; i < (int)max6675_num; i++)
  // {
  //   // Serial.print("Temp sensor #");
  //   // Serial.print(i);
  //   // Serial.print(": ");
  //   // Serial.print(" °C\n");
  // }
    Serial.println(tempSensorsValues[0]);
   delay(500);
}