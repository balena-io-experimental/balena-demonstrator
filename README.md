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
$ git clone https://github.com/resin-io-projects/resin-demo-app
$ cd resin-demo-app
$ npm install
```

Make sure you have these environment variables in a file named `env.json` in `/resin-demo-app`
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

## Adding images

Add new images to ``src/images`` folder. They must be in .png format, with dimensions (WxH) 300x400.

Make sure you have [FFmpeg](http://ffmpeg.org/download.html) installed and run the following:

```
$ cd src/images
$ ./png2fb.sh image-filename.png
```

This will create a .raw image in the ``src/images`` folder.

Finally, commit and push your changes with:

```
$ git commit -am 'Added new images'
$ git push origin master
```

## To start
```
node start
```

Note: currently if you change the `REMOTE` after running `node start` you'll need to delete the  applications repositories rerun the start command. 

```
**Windows users**
git checkout no-tty
more info coming soon
```
