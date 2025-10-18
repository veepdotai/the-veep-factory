#!/bin/bash

. ../.env
sudo service apache2 start
sudo service mysql start

. $NVM_DIR/nvm.sh
#nvm install v22.13.1
