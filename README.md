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

#### repo set-up

```
git clone https://github.com/craig-mulligan/ces-demo && cd ces-demo
```

```
npm install
```

Make sure you have these environment variables in a file named `env.json` in `/ces-demo`
```
{
  "REMOTE": "resin app endpoint",
  "SDK_EMAIL": "resin app email",
  "SDK_PW": "resin pw",
  "APP_NAME": "resin app name",
  "LOGO": "Branding"
  "PICTURE_DEMO": Boolean (If you are using picture demo or app selection)
  "APPS": "array of repositories",
  "IMAGES": "array of images (must have png and raw file in /images folder)",
  "HEADING": For configuring certain strings in the app
}
```

```
**Windows users**
git checkout no-tty
more info coming soon
```
