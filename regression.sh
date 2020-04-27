#!/bin/bash
CWD="$(pwd)"
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
echo -e "${RED}============================================================${NC}"
echo -e "${RED}======================= CLEANING API =======================${NC}"
echo -e "${RED}============================================================${NC}"
cd $api
sudo rm -r node_modules logs package-lock.json dist coverage

#####  domain
echo -e "${RED}============================================================${NC}"
echo -e "${RED}====================== CLEANING DOMAIN =====================${NC}"
echo -e "${RED}============================================================${NC}"
cd $domain
sudo rm -r node_modules logs package-lock.json dist coverage

#####  service
echo -e "${RED}============================================================${NC}"
echo -e "${RED}===================== CLEANING SERVICE =====================${NC}"
echo -e "${RED}============================================================${NC}"
cd $service
sudo rm -r node_modules logs package-lock.json dist coverage

#####  AT
echo -e "${RED}============================================================${NC}"
echo -e "${RED}======================= CLEANING AT ========================${NC}"
echo -e "${RED}============================================================${NC}"
cd $AT
sudo rm -r node_modules logs package-lock.json coverage



##### INSTALL #####

#####  api
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}====================== INSTALLING API =====================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $api
sudo npm i

#####  domain
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}==================== INSTALLING DOMAIN ====================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $domain
sudo npm i

#####  service
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}=================== INSTALLING SERVICE ====================${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $service
sudo npm i

#####  AT
echo -e "${BLUE}===========================================================${NC}"
echo -e "${BLUE}=============== INSTALLING ACCEPTANCE TESTS ===============${NC}"
echo -e "${BLUE}===========================================================${NC}"
cd $AT
sudo npm i



##### COMPILE #####

#####  api
echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}===================== COMPILING API ======================${NC}"
echo -e "${GREEN}==========================================================${NC}"
cd $api
sudo npm run comp

#####  domain
echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}==================== COMPILING DOMAIN ====================${NC}"
echo -e "${GREEN}==========================================================${NC}"
cd $domain
sudo npm run comp

#####  service
echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}==================== COMPILING SERVICE ===================${NC}"
echo -e "${GREEN}==========================================================${NC}"
cd $service
sudo npm run comp

#####  AT
echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}====================== COMPILING AT ======================${NC}"
echo -e "${GREEN}==========================================================${NC}"
cd $AT
sudo npm run comp



##### TEST #####

#####  domain
echo -e "${RED}============================================================${NC}"
echo -e "${RED}================= RUNNING DOMAIN UNIT TESTS ================${NC}"
echo -e "${RED}============================================================${NC}"
cd $domain
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest

#####  service
echo -e "${RED}============================================================${NC}"
echo -e "${RED}================ RUNNING INTEGRATION TESTS =================${NC}"
echo -e "${RED}============================================================${NC}"
cd $service
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest

#####  AT
echo -e "${RED}============================================================${NC}"
echo -e "${RED}================= RUNNING ACCEPTANCE TESTS =================${NC}"
echo -e "${RED}============================================================${NC}"
cd $AT
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 jest




echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}======================== FINISHED ========================${NC}"
echo -e "${GREEN}==========================================================${NC}"
