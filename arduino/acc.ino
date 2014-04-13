/********************************************************************************
* Vittel Up                                                                     *
* Project for Vittel to track dehydration and water consumption using an        *
* arduino Yun and a 1.5 watter bottle.                                          *
*                                                                               *
* Copyright (C) 2014 George Koulouris (george.koulouris1@gmail.com)             * 
*                                                                               *
* License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html> *
* This is free software: you are free to change and redistribute it.            *
* There is NO WARRANTY, to the extent permitted by law.                         *
*                                                                               *
*********************************************************************************/

#include <Process.h>
#include <stdio.h>
#include <Wire.h>
#include <ADXL345.h>

const float alpha = 0.5;
const int timeInt = 10; // Average time to send data
const double Vincrement = 1.5*timeInt / 180000; // Coefficient to increment water to drink

int16_t counter = 0; // Loop counter 

double fXg = 0; // accelerometer value, X
double fYg = 0; // accelerometer value, Y
double fZg = 0; // accelerometer value, Y

double Vprevious = 0; // the water that has been drunk
double Vdrink = 0; // the water that must be drunk

char toServer[80]; // string to store url

ADXL345 acc;

void setup()
{
        Bridge.begin();
	acc.begin();
	Serial.begin(9600);
	delay(100);
}


void loop()
{
	double pitch, roll, Xg, Yg, Zg, Vcurrent;
        int timeDelay;
        char reading[25];;
	acc.read(&Xg, &Yg, &Zg);

	//Low Pass Filter
	fXg = Xg * alpha + (fXg * (1.0 - alpha));
	fYg = Yg * alpha + (fYg * (1.0 - alpha));
	fZg = Zg * alpha + (fZg * (1.0 - alpha));

	//Pitch Equation
	//pitch = (atan2(fXg, sqrt(fYg*fYg + fZg*fZg))*180.0)/M_PI;
        pitch = (atan2(sqrt(fXg*fXg + fYg*fYg), fZg)*180.0)/M_PI;
        
        // Convert the pitch to ml assuming. At 90 we are not yet drinking
        if (abs(pitch) < 70) {
          Vcurrent = 0; 
        } else {
          Vcurrent = 0.50 * (abs(pitch)-70)*(abs(pitch)-70);
        }
        
        // If the current value is larger the previous one, store it and send it
        if (Vprevious < Vcurrent) {
          
          // Calculate the new volume to drink
          Vdrink = Vdrink - (Vcurrent - Vprevious);
           
          // Update the value for the previous volume
          Vprevious = Vcurrent;         
        } else {
          // Increment the drink value (the entire bottle should be drunk in 5h)
          Vdrink = Vdrink + counter * Vincrement;
        }
        
        // Send to server
        strcpy (toServer,"http://gcool.info/vittelup/arduino.php?drink="); 
        dtostrf(Vprevious, 3, 2, reading);
        strcat (toServer,reading);
              
        // The dehydration level is the volume I must drink divided by the total volume of the bottle
        strcat (toServer,"&dehydration=");
        if (Vdrink < 0) {
          dtostrf(0, 3, 2, reading);
        } else {
          dtostrf(Vdrink/1500, 3, 2, reading);
        }
        
        strcat (toServer,reading);
        
        runCurl();
        
        // Increment the loop counter
        counter = counter + 1;
}

bool runCurl() {
  /* Launch "curl" command to check whether the heater is turned on
     curl is command line program for transferring data using different internet protocols */
  /* Create a process and call it "p" */   
  Process p;  

  /* Process that launch the "curl" command */  
  p.begin("curl"); 
  
  /* Add the URL parameter to "curl". It actually performs a GET command on my server. */
  p.addParameter(toServer); 
  
  /* Run the process and wait for its termination */
  p.run();
}
