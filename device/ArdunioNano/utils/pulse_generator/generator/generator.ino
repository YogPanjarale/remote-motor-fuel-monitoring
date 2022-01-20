int Duration = 500;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(2,OUTPUT);
  Serial.println("Start");
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(2,HIGH);
  delay(Duration/2);
  digitalWrite(2,LOW);
  delay(Duration/2);
}
