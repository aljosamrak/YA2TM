#!/bin/bash

set -eo pipefail

BUILD_DIR="dist/YA2TM"
EXTENSION_SEARCH_PATTERN="Extension error: "
RUN_DIR="build"

# Load extension to Chrome and run Chrome as fresh start
google-chrome \
  --user-data-dir="$RUN_DIR" \
  --load-extension="$BUILD_DIR" \
  --no-first-run \
  --enable-logging --v=1 \
  &

# Wait one second and kill the chrome process
sleep 1
kill "$!"

# Grep the logs for any extension errors
errors=$(grep "$EXTENSION_SEARCH_PATTERN" "$RUN_DIR/chrome_debug.log")

# Exit with error if any extension errors present
if [[ $errors ]]; then
  echo "${errors##*$EXTENSION_SEARCH_PATTERN}"
  exit 1
fi
