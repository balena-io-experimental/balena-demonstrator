# electron-resin-conference-demo-app

## To Use

Follow this getting started guide to get your device connected to [resin.io](https://resin.io/)

Running on a non-resin device:
```
git clone https://github.com/craig-mulligan/ces-demo && cd ces-demo
```
Make sure you have these environment variables in a file named `env.json`
```
{
  "PUB": "pubnub pubkey",
  "SUB": "pubnub subkey",
  "REMOTE": "resin app endpoint",
  "SDK_EMAIL": "resin app email",
  "SDK_PW": "resin pw",
  "APP_NAME": "resin app name"
}
```
Then run (for setup and anytime you want to run the app):
```
bash init.sh
```
