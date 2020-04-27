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
