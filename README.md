# Bitcoin Prediction
 Web app that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.
 
 [LIVE DEMO](https://main.dii3vgda18n64.amplifyapp.com/)
 
 One can see Bitcoin price evolution over time (updated every 30s) and guess if the bitcoin price will go UP or DOWN in the next price update after one minute as passed.
 A graph is presented with bitcoin price capture.
 It's also possible to start and stop bitcoin pricing updates by clicking START/STOP SCHEDULE
 
 To save collected points, one can login with [metamask](https://metamask.io/) .
 Metamask is a browser extension that integrate with ethereum web3. If you don't own a ethereum account, it very easy to create a new one at metamask.
 
 User data is saved at AWS datastore, using AWS Amplify tools.
 
 Bitcoin prices are fetch from [Messari.io](https://messari.io/) API.
 
 
 
 # Run and deploy
 To run this application one needs to pre-install
 * nodejs >14

 Running for the first time, one need to import necessary dependencies, so execute:
 > npm install
 
 To start just execute at terminal:
 > npm start

 The application will be available ate http:/localhost:3000

 For deployment, the aplication uses AWS amplify CI/CD attached to repo branches.
 But one can execute the following to generate deployment files:
 > npm run build

 To run tests just execute:
 > npm test
