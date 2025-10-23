#!/bin/bash
#

. ${1}
echo "CERTS_DIR: $RP_CERTS_DIR."

mkdir -p ${RP_CERTS_DIR}

openssl req -x509 -nodes \
  -days 365 \
  -newkey rsa:2048 \
  -keyout "${RP_CERTS_DIR}/local.key" \
  -out "${RP_CERTS_DIR}/local.crt" \
  -subj "/CN=*.docker.localhost"
