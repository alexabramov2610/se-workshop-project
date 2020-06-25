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
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#####  websocket
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING WEBSOCKET ====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $websocket
#sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

##### publisher
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING PUBLISHER =================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $publisher
#sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  domain
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING DOMAIN ====================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $domain
#sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}==================== COMPILING SERVICE ===================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $service
#sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"



#################################################################################
###############################       TEST       ################################
#################################################################################

#####  domain
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================= RUNNING DOMAIN UNIT TESTS ================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $domain
#sudo jest --clearCache
#sudo TEST_MODE=1 SILENT=1 MONGODB_URI=mongodb://localhost:27017/dev-trading-system-db jest --maxWorkers=1 --forceExit --detectOpenHandles && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  service
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}================ RUNNING INTEGRATION TESTS =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $service
sudo jest --clearCache
sudo TEST_MODE=1 SILENT=1 MONGODB_URI=mongodb://localhost:27017/dev-trading-system-db jest --maxWorkers=1 --forceExit --detectOpenHandles && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"



echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}======================== FINISHED ========================${NC}"
echo -e "${BLUE}==========================================================${NC}"
