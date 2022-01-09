#include <Arduino.h>

//led pin
#define LED_PIN 13
//buzzer pin
#define BUZZER_PIN 27

#define BLYNK_TEMPLATE_ID "TMPLheeCQC0J"
#define BLYNK_DEVICE_NAME "pulse simulator generator"
#define BLYNK_AUTH_TOKEN "xd5j14iwbgQOTYaTPkagCrM7-uZV7swF"

// Comment this out to disable prints and save space
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

char auth[] = BLYNK_AUTH_TOKEN;

// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "PANJARALE_HOSPITAL";
char pass[] = "12031975";

//pulse frequency in Hz
int pulses[2] = {0,0};

// Blynk Task with Blynk run function
void BlynkTask(void *parameter)
{
  for (;;)
  {
    Blynk.run();
    vTaskDelay(1);
  }
}

void Pulse1Task(void *parameters){
  for(;;){
    if(pulses[0] > 0){
      Serial.println("pulse 1");

      digitalWrite(LED_PIN, HIGH);
      vTaskDelay(1000 / pulses[0]);
      digitalWrite(LED_PIN, LOW);
      vTaskDelay(1000 / pulses[0]);
    }else{
    vTaskDelay(100);
    }
  }
}

void Pulse2Task(void *parameters){
  for(;;){
    if(pulses[1] > 0){
      Serial.println("pulse 2");
      digitalWrite(BUZZER_PIN, HIGH);
      vTaskDelay(1000 / pulses[1]);
      digitalWrite(BUZZER_PIN, LOW);
      vTaskDelay(1000 / pulses[1]);

    }else{
   vTaskDelay(100);
    }
  }
}

void setup()
{
  // Debug console
  Serial.begin(115200);

  // Connect to Blynk server.
  Blynk.begin(auth, ssid, pass);
  
  //set up the pins as an output
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  // Start Blynk task
  xTaskCreatePinnedToCore(
      BlynkTask, /* Task function. */
      "Blynk",   /* name of task. */
      10000,     /* Stack size of task */
      NULL,      /* parameter of the task */
      1,         /* priority of the task */
      NULL,      /* Task handle to keep track of created task */
      0);        /* pin task to core 0 */
  
  // Start Pulse1 task
  xTaskCreatePinnedToCore(
      Pulse1Task, /* Task function. */
      "Pulse1",   /* name of task. */
      1000,     /* Stack size of task */
      NULL,      /* parameter of the task */
      1,         /* priority of the task */
      NULL,      /* Task handle to keep track of created task */
      1);        /* pin task to core 1 */
  // Start Pulse2 task
  xTaskCreatePinnedToCore(
      Pulse2Task, /* Task function. */
      "Pulse2",   /* name of task. */
      1000,     /* Stack size of task */
      NULL,      /* parameter of the task */
      1,         /* priority of the task */
      NULL,      /* Task handle to keep track of created task */
      1);        /* pin task to core 1 */
}

BLYNK_WRITE(V0)
{
  int pinValue = param.asInt();
  Serial.print("V0 (Switch) : ");
  Serial.println(pinValue);
  if (pinValue == 1)
  {
    digitalWrite(LED_PIN, HIGH);
  }
  else
  {
    digitalWrite(LED_PIN, LOW);
  }
}

BLYNK_WRITE(V1)
{
  int pinValue = param.asInt();
  Serial.print("V1 (Pulse 1) : ");
  Serial.println(pinValue);
  pulses[0] = pinValue;
}
BLYNK_WRITE(V2)
{
  int pinValue = param.asInt();
  Serial.print("V2 (Pulse 2) : ");
  Serial.println(pinValue);
  pulses[1] = pinValue;
}
void loop()
{
  // Pulse1Task(NULL);
}