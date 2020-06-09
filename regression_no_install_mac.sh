#!/bin/bash
CWD="$(pwd)"
api="$CWD/se-workshop-20-interfaces"
AT="$CWD/AT"
domain="$CWD/backend/domain"
service="$CWD/backend/service"
client="$CWD/client"
http="$CWD/communication/http"
websocket="$CWD/communication/websocket"
publisher="$CWD/publisher"
dal="$CWD/data-access"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color


#################################################################################
##############################       COMPILE       ##############################
#################################################################################

#####  api
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}===================== COMPILING API ======================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $api
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  dal
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}===================== COMPILING DAL ======================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $dal
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  client
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING CLIENT ====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $client
# npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  websocket
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}=================== COMPILING WEBSOCKET ==================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $websocket
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  publisher
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}=================== COMPILING PUBLISHER ==================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $publisher
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  domain
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING DOMAIN ====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $domain
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING SERVICE ===================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $service
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  http
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}===================== COMPILING HTTP =====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $http
 npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  AT
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}====================== COMPILING AT ======================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $AT
# npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"



#################################################################################
###############################       TEST       ################################
#################################################################################

#####  domain
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================= RUNNING DOMAIN UNIT TESTS ================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $domain
 jest --clearCache
 TEST_MODE=1 SILENT=1 jest --maxWorkers=1  --forceExit --detectOpenHandles && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================ RUNNING INTEGRATION TESTS =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $service
 jest --clearCache
 TEST_MODE=1 SILENT=1 jest --maxWorkers=1  --forceExit --detectOpenHandles && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  AT
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================= RUNNING ACCEPTANCE TESTS =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $AT
# jest --clearCache
# TEST_MODE=1 SILENT=1 jest --maxWorkers=1  --forceExit --detectOpenHandles && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"




echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}======================== FINISHED ========================${NC}"
echo -e "${BLUE}==========================================================${NC}"
