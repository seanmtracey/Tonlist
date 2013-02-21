#Tonlist

Tonlist was a hackday project that I made for HackBMTH.

I was constantly annoyed that despite having Spotify and a sizable iPhone, I still couldn't access all of my music wherever I liked. I decided to write a Python script that would take my iTunes library XML, Get where all of my files live and then upload them to a server of my choice. A basic PHP API allows me to access my online music library with a simple Web App and play any track I like with the HTML5 <audio> element. 

Still needs some work...

###Installation Instructions

Create a directory on your server
In this drop the listFiles.php file in this folder, create a 'music' folder, an 'app' folder.
Drag the contents of 'App' to app and then run the uploadLibrary.py file on your machine after pointing it to your iTunes library XML