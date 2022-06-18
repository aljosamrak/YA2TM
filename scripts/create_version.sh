#!/bin/bash

# Get the current version from package.json
VERSION=$(jq -r '.version' package.json)

# Check if version need to be updated - matching 'xx.xx.xx'
version_match="^[0-9]+\.[0-9]+\.[0-9]+$"
if ! [[ $VERSION =~ $version_match ]]; then
  exit 0
fi

if [[ -z "${CIRCLE_BUILD_NUM}" ]]; then
  # If 'CIRCLE_BUILD_NUM' is empty append 'dev' to the version
  VERSION="${VERSION}-dev"
else
  # If 'CIRCLE_BUILD_NUM' is not empty append it to teh version
  VERSION="${VERSION}.${CIRCLE_BUILD_NUM}"
fi

echo "Updating version to: '$VERSION'"

# Set back the new version to the 'package.json'
jq --arg VERSION "$VERSION" '.version = $VERSION' package.json >package.tmp && mv package.tmp package.json

# Propagate the version also to the 'manifest.json'
jq --arg VERSION "$VERSION" '.version = $VERSION' src/manifest.json >src/manifest.tmp && mv src/manifest.tmp src/manifest.json
