#!/bin/bash
CWD="$(pwd)"
api="$CWD/se-workshop-20-interfaces"
AT="$CWD/AT"
domain="$CWD/backend/domain"
service="$CWD/backend/service"
client="$CWD/client"
communication="$CWD/communication"
publisher="$CWD/backend/node_modules/publisher"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color


##### CLEAN #####

#####  api
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}======================= CLEANING API =======================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $api
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  client
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}====================== CLEANING CLIENT =====================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $client
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  communication
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}=================== CLEANING COMMUNICATION =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $communication
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  publisher
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}===================== CLEANING PUBLISHER ===================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $publisher
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  domain
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}====================== CLEANING DOMAIN =====================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $domain
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  service
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}===================== CLEANING SERVICE =====================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $service
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  AT
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}======================= CLEANING AT ========================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $AT
sudo rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"



##### INSTALL #####

#####  api
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}====================== INSTALLING API =====================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $api
sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  client
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}===================== INSTALLING CLIENT ===================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $client
#sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  domain
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}==================== INSTALLING DOMAIN ====================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $domain
sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}=================== INSTALLING SERVICE ====================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $service
sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  communication
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}================ INSTALLING COMMUNICATION =================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $communication
sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  publisher
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}================== INSTALLING PUBLISHER ===================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $publisher
sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  AT
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}=============== INSTALLING ACCEPTANCE TESTS ===============${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $AT
sudo npm i && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"



##### COMPILE #####

#####  api
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}===================== COMPILING API ======================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $api
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  client
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING CLIENT ====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $client
#sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  publisher
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}=================== COMPILING PUBLISHER ==================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $publisher
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  domain
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING DOMAIN ====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $domain
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING SERVICE ===================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $service
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  communication
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}================= COMPILING COMMUNICATION ================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $communication
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"


#####  AT
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}====================== COMPILING AT ======================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $AT
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"



##### TEST #####

#####  domain
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================= RUNNING DOMAIN UNIT TESTS ================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $domain
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================ RUNNING INTEGRATION TESTS =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $service
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  AT
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================= RUNNING ACCEPTANCE TESTS =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $AT
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"




echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}======================== FINISHED ========================${NC}"
echo -e "${BLUE}==========================================================${NC}"
