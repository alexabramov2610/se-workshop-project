#!/bin/bash
CWD="$(pwd)"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

http="$CWD/communication/http"

cd $http
#sudo npm run comp
npm run start:prod


