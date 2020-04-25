#!/bin/bash
# redirect stdout/stderr to a file
CWD="$(pwd)"
#LOG_LOCATION="$CWD/regression.log"
#exec > >(tee -i $LOG_LOCATION)
#exec 2>&1

AT="$CWD/AT"
domain="$CWD/backend/domain"
service="$CWD/backend/service"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color


##### CLEAN #####

#####  domain
echo -e "${RED}cleaning domain folder...${NC}"
cd $domain
rm -r node_modules logs package-lock.json dist coverage

#####  service
echo -e "${RED}cleaning service folder...${NC}"
cd $service
rm -r node_modules logs package-lock.json dist coverage

#####  AT
echo -e "${RED}cleaning AT folder...${NC}"
cd $AT
rm -r node_modules dist logs package-lock.json coverage


##### Pulling from master #####

#####  domain
echo -e "${GREEN}puliing from master...${NC}"
echo -e "${GREEN}FIX YOUR CONFLICTS BEFORE MAKING PR...${NC}"
echo -e "${GREEN}you can type :x and press enter to make the silent merge after the pull...${NC}"
echo -e "${GREEN}SOMETIME YOU WILL HAVE CONFLICTS PLEASE FIX THEM AND RERUN THIS SCRIPT!${NC}"
git pull origin master

##### INSTALL #####

#####  domain
echo -e "${BLUE}installing domain...${NC}"
cd $domain
npm i

#####  service
echo -e "${BLUE}installing service...${NC}"
cd $service
npm i

#####  AT
echo -e "${BLUE}installing AT...${NC}"
cd $AT
npm i



##### COMPILE #####

#####  domain
echo -e "${GREEN}compiling domain...${NC}"
cd $domain
npm run comp

#####  service
echo -e "${GREEN}compiling service...${NC}"
cd $service
npm run comp

#####  AT
echo -e "${GREEN}compiling AT...${NC}"
cd $AT
npm run comp



##### TEST #####

#####  domain
echo -e "${RED}testing domain...${NC}"
cd $domain
npm start jest --clearCache
npm run test:silent

#####  AT
echo -e "${RED}testing AT...${NC}"
cd $AT
npm start jest --clearCache
npm run test:silent
