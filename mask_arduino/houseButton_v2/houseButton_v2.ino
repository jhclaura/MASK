
const int buttonPin = 8;
const int buttonBPin = 7;

int buttonPressed = 0;
int buttonBPressed = 0;

int buttonStatus = 0;
int pastButtonStatus = 0;

void setup() 
{
  Serial.begin(9600);
  pinMode(buttonPin, INPUT);
  pinMode(buttonBPin, INPUT);
  
}

void loop() 
{
  buttonPressed = digitalRead(buttonPin);
  buttonBPressed = digitalRead(buttonBPin);
  
//  if(buttonPressed==1 && (buttonStatus==pastButtonStatus)){
//    
//    buttonStatus = 1;
//    Serial.println(1);
//    
//  }
//  
//  if(buttonPressed==0 && (buttonStatus!=pastButtonStatus)){
//    
//    buttonStatus = 0;
//    pastButtonStatus = 0;
//    Serial.println(0);
//    
//  }
  
  Serial.print(buttonPressed);
  Serial.print(", ");
  Serial.println(buttonBPressed);
  
}
