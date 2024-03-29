#!/bin/bash

set -eo pipefail

# Get the current version from package.json
VERSION=$(jq -r '.version' package.json)

# Extract the original version without the appended part - matching 'xx.xx.xx'
version_match="^([0-9]+\.[0-9]+\.[0-9]+)"
[[ $VERSION =~ $version_match ]] && VERSION="${BASH_REMATCH[1]}"

if [[ -n "${CIRCLE_BUILD_NUM}" ]]; then
  # If 'CIRCLE_BUILD_NUM' is not empty append it to the version
  VERSION="${VERSION}.${CIRCLE_BUILD_NUM}"
fi

echo "Updating version to: '$VERSION'"

# Set back the new version to the 'package.json'
jq --arg VERSION "$VERSION" '.version = $VERSION' package.json >package.tmp && mv package.tmp package.json

# Propagate the version also to the 'manifest.json'
jq --arg VERSION "$VERSION" '.version = $VERSION' src/manifest.json >src/manifest.tmp && mv src/manifest.tmp src/manifest.json
