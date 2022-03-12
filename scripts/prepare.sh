#!/bin/bash -e

mkdir -p lib && cat package.json | jq 'del(.scripts)' > lib/package.json