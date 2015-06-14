// ref: http://electronics.stackexchange.com/questions/42117/touching-person-to-person

int analogPins[] = { A0, A1, A2, A3, A4 };
int digitalPins[] = { 2, 4, 7, 8, 12 };
        
int inputValueA = 0;
int inputValueB = 0;

int inputValues[5] = { 0 };

int variance;
int variances[5][5] = { 0 };

int dataVal[20] = { 0 };

boolean touches[10] = { false };
//boolean 3pTouch;
//boolean 4pTouch;
//boolean 5pTouch;
//01, 02, 03, 04, 12, 13, 14, 23, 24, 34

///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

void setup() {
  Serial.begin(9600);

  for(int i=0; i<5; i++) {
    pinMode(digitalPins[i], OUTPUT);
  }
}

void loop() {
  
  // each player's analog reading
  for(int i=0; i<5; i++) {
    
    // to get other player's digital output
    for(int j=0; j<5; j++) {
      
      // avoid getting itself's digital output
      if(j != i){
        for(int n=0;n<8;n+=2) {
          
          pinMode(digitalPins[j],INPUT);
          digitalWrite(digitalPins[j],HIGH); // square wave HIGH (through pull up resistor)
          delay(2); // let things settle + don't run analogReads too close together
          
          int tmp1 = analogRead(analogPins[i]);
          
          pinMode(digitalPins[j],OUTPUT);
          digitalWrite(digitalPins[j],LOW);//square wave LOW (as output)    
          delay(2); // let things settle + don't run analogReads too close together
          int tmp2 = analogRead(analogPins[i]);
          
          int diff = tmp1-tmp2;
//          abs(diff);
          variances[i][j] += diff;
        }
      }
      
//      if(i==0){
//        Serial.print("player: ");
//        Serial.print(i);
//        Serial.print("'s variance with ");
//        Serial.print(j);
//        Serial.print(" is: ");
//        Serial.println(variances[i][j]);
//      }
      
      
      //////////////////////////////////////////////////
      // TWEAK!!!!!!!!!!!!!!!!!!!!!!!!!!
      //////////////////////////////////////////////////
      
      if(variances[i][j]>800){
//        Serial.print("p layer ");
//        Serial.print(i);
//        Serial.print(" touches ");
//        Serial.println(j);
        
        if   ((i==0 && j==1) || (i==1 && j==0)) Serial.println( 0 );
        
        if   ((i==0 && j==2) || (i==2 && j==0)) Serial.println( 1 );
        
        if   ((i==0 && j==3) || (i==3 && j==0)) Serial.println( 2 );
        
        if   ((i==0 && j==4) || (i==4 && j==0)) Serial.println( 3 );
        
        if   ((i==1 && j==2) || (i==2 && j==1)) Serial.println( 4 );
        
        if   ((i==1 && j==3) || (i==3 && j==1)) Serial.println( 5 );
        
        if   ((i==1 && j==4) || (i==4 && j==1)) Serial.println( 6 );
        
        if   ((i==2 && j==3) || (i==3 && j==2)) Serial.println( 7 );
        
        if   ((i==2 && j==4) || (i==4 && j==2)) Serial.println( 8 );
        
        if   ((i==3 && j==4) || (i==4 && j==3)) Serial.println( 9 );

      } 
      variances[i][j]=0;
    }
  }
  
  // for debugging
//  Serial.print("AB: ");  Serial.print( touches[0] );
//  Serial.print(", AC: ");  Serial.print( touches[1] );
//  Serial.print(", AD: ");  Serial.print( touches[2] );
//  Serial.print(", AE: ");  Serial.print( touches[3] );
//  Serial.print(", BC: ");  Serial.print( touches[4] );
//  Serial.print(", BD: ");  Serial.print( touches[5] );
//  Serial.print(", BE: ");  Serial.print( touches[6] );
//  Serial.print(", CD: ");  Serial.print( touches[7] );
//  Serial.print(", CE: ");  Serial.print( touches[8] );
//  Serial.print(", DE: ");  Serial.println( touches[9] );

//  Serial.print( touches[0] ); Serial.print(",");
//  Serial.print( touches[1] ); Serial.print(",");
//  Serial.print( touches[2] ); Serial.print(",");
//  Serial.print( touches[3] ); Serial.print(",");
//  Serial.print( touches[4] ); Serial.print(",");
//  Serial.print( touches[5] ); Serial.print(",");
//  Serial.print( touches[6] ); Serial.print(",");
//  Serial.print( touches[7] ); Serial.print(",");
//  Serial.print( touches[8] ); Serial.print(",");
//  Serial.println( touches[9] );

} 
