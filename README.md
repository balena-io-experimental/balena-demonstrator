# electron-resin-conference-demo-app

## To Use

#### Initial set-up
Follow this getting started guide to get your device connected to [resin.io](https://resin.io/)

1. make sure you have node and git install
2. make sure you have [ssh client set-up](https://help.github.com/articles/generating-ssh-keys/).
3. add you id_rsa.pub key to unicorn@resin.io account
4. set up a git user by Running
```
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

```
git clone https://github.com/craig-mulligan/ces-demo
```
```
git clone https://github.com/craig-mulligan/simple-beast-fork && cd simple-beast-fork && git remote add resin unicorn@git.resin.io:unicorn/microbeast.git;
```

```
cd ../ces-demo
```

**Windows users**
```
git checkout no-tty
```

```
npm install
```

Make sure you have these environment variables in a file named `env.json` in `/ces-demo`
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

#### To run
```
npm start
```
