# www / gulp-presale

## Server setup

### Linux/Debian/Ubuntu
Ensure you have an updated version of nodejs and npm installed. Ubuntu repos often contain an old version, so it's recommend to use a more [up-to-date repo](https://launchpad.net/~chris-lea/+archive/node.js/).

If you already had nodejs installed and need it updated, make sure to `sudo apt-get update && sudo apt-get upgrade`. Otherwise a `sudo apt-get install nodejs npm` should be sufficient.

### Mac
`brew install node`

### Windows
Install node from http://nodejs.org/download/ and open the node command prompt.

Assuming nodejs/npm is correctly installed, the next step is to install gulp with `sudo npm -g install gulp`.


## Project setup
```
npm install && gulp build
```

This will install all dependencies and compile the site to ./build/ (or whatever is defined as basePaths.dest in gulpfile.js). To instruct gulp to compile for production, pass `--prod` and possibly `gulp bundle` to compress it into a zip. For example:

```
gulp build --prod && gulp bundle
```

Or use the default dev task, which launches a local live-reload server for preview:

```
gulp
```

