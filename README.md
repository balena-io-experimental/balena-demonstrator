# electron-rpi-quick-start

This fork of the [electron-quick-start](https://github.com/atom/electron-quick-start) app was made to jumpstart any electron app development on the rasperrypi (or any [resin.io supported device that has screen output](https://resin.io/#supported-devices)). Resin.io allows you to easily deploy and manage your application across a fleet of devices making it a great fit for distributed electron app. You can read more about how resin.io works [here](https://resin.io/how-it-works/)

## To Use

Follow this getting started guide to get your device connected to [resin.io](https://resin.io/)

Then clone this repository
```
git clone https://github.com/craig-mulligan/DockerCon-Visuals && cd DockerCon-Visuals
```

Add your resin.io applications remote endpoint
```
git add remote resin <username>@git.resin.io:<username>/<app-name>.git
```

Push your application to your device and make sure it has a screen attached.

```
git push resin master
```

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/latest/tutorial/quick-start).

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/latest).
