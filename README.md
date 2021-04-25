To run the app...


install node.js https://nodejs.dev/learn/how-to-install-nodejs
clone this repository
cd into WebsocketsServer and run the following command

    python3 server.py

(Note: it runs on localhost port 8888 so make sure this port is free)
run two android emulators from android studio


cd into AndroidScrabbleReact and run the following command

    npm install

This should install all the dependencies
Now run the following command (from AndroidScrabbleReact)

    npx react-native start

Wait for it to finish setting up
Now run the following command (from AndroidScrabbleReact)

    npx react-native run-android

It might take a minute to complete
Refresh each emulator 
If you get the error "Attempt to invoke interface method ..." then just keep
refreshing until it goes away.
The app should be running now.