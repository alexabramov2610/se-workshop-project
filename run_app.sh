#!/bin/bash
CWD="$(pwd)"

http="$CWD/communication/http"

cd $http
sudo npm run comp
sudo npm run start:prod
