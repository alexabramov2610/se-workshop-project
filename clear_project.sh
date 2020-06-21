#!/bin/bash
CWD="$(pwd)"
api="$CWD/se-workshop-20-interfaces"
AT="$CWD/AT"
domain="$CWD/backend/domain"
service="$CWD/backend/service"
client="$CWD/client"
communication="$CWD/communication"
publisher="$CWD/publisher"
dal="$CWD/data-access"
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
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  dal
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}======================= CLEANING DAL =======================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $dal
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  client
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}====================== CLEANING CLIENT =====================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $client
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  communication
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}=================== CLEANING COMMUNICATION =================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $communication
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  publisher
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}===================== CLEANING PUBLISHER ===================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $publisher
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  domain
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}====================== CLEANING DOMAIN =====================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $domain
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  service
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}===================== CLEANING SERVICE =====================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $service
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"

#####  AT
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}======================= CLEANING AT ========================${NC}"
echo -e "${BLUE}============================================================${NC}"
cd $AT
rm -r node_modules logs package-lock.json dist coverage && echo -e "${GREEN}FINISHED${NC}"




echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}======================== FINISHED ========================${NC}"
echo -e "${BLUE}==========================================================${NC}"
