#!/bin/bash
CWD="$(pwd)"
api="$CWD/se-workshop-20-interfaces"
AT="$CWD/AT"
domain="$CWD/backend/domain"
service="$CWD/backend/service"
client="$CWD/client"
communication="$CWD/communication"
publisher="$CWD/publisher"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color



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

#####  publisher
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}=================== COMPILING PUBLISHER ==================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $publisher
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"

#####  AT
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}====================== COMPILING AT ======================${NC}"
echo -e "${BLUE}==========================================================${NC}"
cd $AT
sudo npm run comp && echo -e "${GREEN}FINISHED${NC}" || echo -e "${RED}FAILED${NC}"


echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}======================== FINISHED ========================${NC}"
echo -e "${BLUE}==========================================================${NC}"
