#!/bin/bash

set -eu -o
FILE_NAME=$1

curlf() {
  OUTPUT_FILE=$(mktemp)
  HTTP_CODE=$(curl --silent --output "$OUTPUT_FILE" --write-out "%{http_code}" "$@")

  if [[ ${HTTP_CODE} -lt 200 || ${HTTP_CODE} -gt 299 ]] ; then
    >&2 cat $OUTPUT_FILE
    return 22
  fi

  cat "$OUTPUT_FILE"
  rm "$OUTPUT_FILE"
}

ACCESS_TOKEN=$(curlf "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token)

echo "Got access token"

curl \
-H "Authorization: Bearer $ACCESS_TOKEN"  \
-H "x-goog-api-version: 2" \
-X PUT \
-T "$FILE_NAME" \
-v \
"https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID"
