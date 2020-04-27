#!/bin/bash
# redirect stdout/stderr to a file
CWD="$(pwd)"
#LOG_LOCATION="$CWD/regression.log"
#exec > >(tee -i $LOG_LOCATION)
#exec 2>&1

api="$CWD/se-workshop-20-interfaces"
AT="$CWD/AT"
domain="$CWD/backend/domain"
service="$CWD/backend/service"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color


##### CLEAN #####

#####  api
echo -e "${RED}cleaning api folder...${NC}"
cd $api
sudo rm -r node_modules logs package-lock.json dist coverage

#####  domain
echo -e "${RED}cleaning domain folder...${NC}"
cd $domain
sudo rm -r node_modules logs package-lock.json dist coverage

#####  service
echo -e "${RED}cleaning service folder...${NC}"
cd $service
sudo rm -r node_modules logs package-lock.json dist coverage

#####  AT
echo -e "${RED}cleaning AT folder...${NC}"
cd $AT
sudo rm -r node_modules logs package-lock.json coverage



##### INSTALL #####

#####  api
echo -e "${BLUE}installing api...${NC}"
cd $api
sudo npm i

#####  domain
echo -e "${BLUE}installing domain...${NC}"
cd $domain
sudo npm i

#####  service
echo -e "${BLUE}installing service...${NC}"
cd $service
sudo npm i

#####  AT
echo -e "${BLUE}installing AT...${NC}"
cd $AT
sudo npm i



##### COMPILE #####

#####  api
echo -e "${GREEN}compiling api...${NC}"
cd $api
sudo npm run comp

#####  domain
echo -e "${GREEN}compiling domain...${NC}"
cd $domain
sudo npm run comp

#####  service
echo -e "${GREEN}compiling service...${NC}"
cd $service
sudo npm run comp

#####  AT
echo -e "${GREEN}compiling AT...${NC}"
cd $AT
sudo npm run comp



##### TEST #####

#####  domain
echo -e "${RED}testing domain...${NC}"
cd $domain
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest

#####  service
echo -e "${RED}testing service...${NC}"
cd $service
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest

#####  AT
echo -e "${RED}testing AT...${NC}"
cd $AT
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest
