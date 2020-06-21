#!/bin/bash
CWD="$(pwd)"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

http="$CWD/communication/http"


exitfn () {
    trap SIGINT              # Restore signal handling for SIGINT
    echo; echo -e "${RED}stopping mongo.."    # Growl at user,
    service mongod stop && echo -e "${GREEN}mongoDB closed!${NC}" || echo -e "${RED}mongoDB close FAILED!${NC}"
    exit                     #   then exit script.
}
#trap "exitfn" INT            # Set up SIGINT trap to call function.


service mongod start && echo -e "${GREEN}mongoDB started!${NC}" || echo -e "${RED}mongoDB FAILED!${NC}"

cd $http
#npm run comp
npm run start:dev


