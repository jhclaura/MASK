
// LED_setup
int value;
int interval;  //to trigger the change of LEDs
int ledPins[] = {
  3, 5, 6, 9, 10, 11
};
//output
int maxV = 245;
int minV = 5;

//
// Patterns
int lastFade[6] = {
  0
};
int level[] = {
  10, 23, 45, 50, 100, 205
};

//slope & intercept
double ain[6], bin[6], aex[6], bex[6];

//time
double inTime[] = {
  1500, 1700, 1900, 2000, 2100, 2300
};
double pauseTime[] = {
  250, 300, 350, 400, 450, 500
};// all sub 100
double outTime[] = {
  1800, 2000, 2200, 2300, 2400, 2600
};// all sub 200
double thirdT[6], cycleT[6];
double levels[6];

boolean lightUp[6];
int awareTime[] = {
  0, 1, 2, 3, 4, 5
};
int awareOriTime[] = {
  0, 1, 2, 3, 4, 5
};
unsigned long tstart[6];
double time;

//
// @ browser: HIVE
int inByte = 0;
int moveInIndex = -1;
int moveOutIndex = -1;
int hiveIndex[] = {
  0, 1, 2, 3, 4, 5
};
boolean inCell[6];
boolean ledOn[6];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

void setup() {
  Serial.begin(9600);

  for (int i = 0; i < 6; i++) {
    pinMode(ledPins[i], OUTPUT);
    //
    inCell[i] = false;
    ledOn[i] = false;
    //
    thirdT[i] = inTime[i] + pauseTime[i];
    cycleT[i] = inTime[i] + pauseTime[i] + outTime[i];

    ain[i] = (maxV - minV) / inTime[i];
    bin[i] = minV;
    aex[i] = (minV - maxV) / outTime[i];
    bex[i] = maxV - aex[i] * (inTime[i] + pauseTime[i]);

    lightUp[i] = false;
  }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////


void loop() {

  if ( Serial.available() > 0 ) {

    moveInIndex = Serial.parseInt();
    moveOutIndex = Serial.parseInt();

    if (moveInIndex > -1)  inCell[moveInIndex] = true;
    if (moveOutIndex > -1) inCell[moveOutIndex] = false;
  }

  delay(10);

  //  Serial.println(inByte);

  for (int userIndex = 0; userIndex < 6; userIndex++) {
    //    if(inCell[i]){
    //      analogWrite(ledPins[i], 220);
    //    }else{
    //      analogWrite(ledPins[i], 0);
    //    }

    // if a bee is connected
    if (inCell[userIndex]) {
      
        //if time can be dividable by 6
        if ( (awareTime[userIndex])%6 == 0 ) {
          lightUp[userIndex] = !lightUp[userIndex];
        }
        
        if(lightUp[userIndex] == true)
          levels[userIndex] = maxV;
        else
          levels[userIndex] = 0;
        
        analogWrite(ledPins[userIndex], levels[userIndex]);
        
        //determin whether to restart the cycle of time
        awareTime[userIndex] += 1;
        
        if( awareTime[userIndex] >= (180) )
          awareTime[userIndex] = awareOriTime[0];
    }
    
    //if not, do LED pattern
    else {
      if (lastFade[userIndex] <= inTime[userIndex]) {
        levels[userIndex] = int( ain[userIndex]*lastFade[userIndex] + bin[userIndex] );
      }
      else if (lastFade[userIndex] <= thirdT[userIndex]) {
        levels[userIndex] = maxV;
      }
      else {
        levels[userIndex] = int( aex[userIndex]*lastFade[userIndex] + bex[userIndex] );
      }

      analogWrite(ledPins[userIndex], levels[userIndex]);
      delay(5);

      //determin whether to restart the cycle of time
      if(lastFade[userIndex] >= cycleT[userIndex]) {
        lastFade[userIndex] = 0;
        tstart[userIndex] = millis();
      }
      else {
        lastFade[userIndex] = millis() - tstart[userIndex];
      }
    }
    
    
  }

}
