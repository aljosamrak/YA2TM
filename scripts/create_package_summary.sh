#!/bin/bash

set -eo pipefail

# Get summary from README.md
SUMMARY=$(sed -n '/<!---Summary-->/,/<!---Summary-->/{/<!---Summary-->/b;p}' README.md)

echo "Updating description to: '$SUMMARY'"

# Set the description to the 'manifest.json'
jq --arg SUMMARY "$SUMMARY" '.description = $SUMMARY' src/manifest.json >src/manifest.tmp && mv src/manifest.tmp src/manifest.json
