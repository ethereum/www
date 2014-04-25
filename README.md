# ethereum-plexus

## Server setup

### Linux/Debian/Ubuntu
Ensure you have an updated version of nodejs and npm installed. Ubuntu repos often contain an old version, so it's recommend to use a more [up-to-date repo](https://launchpad.net/~chris-lea/+archive/node.js/).
If you already had nodejs installed and need it updated, make sure to `sudo apt-get update && sudo apt-get upgrade`. Otherwise a `sudo apt-get install nodejs npm` should be sufficient.

Assuming nodejs/npm is correctly installed, the next step is to install Sails with `sudo npm -g install sails`. If you get lots of errors, you may not have an old version of nodejs installed. Use the PPA above if possible :)

To install gem for ruby, run:
sudo apt-get install libgemplugin-ruby

### Mac
`brew install node`

### Windows
Install node from http://nodejs.org/download/ and open the node command prompt.

## Project setup
```
npm -g install sails
cd ~
git clone git@github.com:holon000/ethereum-plexus.git
cd ethereum-plexus
git submodule init
sudo gem install sass
sudo npm install -d
sails lift
```

Sails will report the interface/port it's listening on. To make configuration changes for different environments, modify config/local.js.

Happy hacking!
