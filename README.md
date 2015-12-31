# electron-resin-conference-demo-app

## To Use

Follow this getting started guide to get your device connected to [resin.io](https://resin.io/)

Running on a non-resin device:
```
git clone https://github.com/craig-mulligan/ces-demo && cd ces-demo
```
Make sure you have these environment variables in a file named `env.sh`
```
PUB= pubnub publishing channel
SUB= pubnub subscribe channel
REMOTE=your slave apps endpoint
SDK_EMAIL=you resin account email
SDK_PW=you resin account pw
APP_NAME=myApp
```
Then run (for setup and anytime you want to run the app):
```
bash init.sh
```
