#!/usr/bin/env bash
rm -rf node_modules
rm -rf package-lock.json
for i in $(ls -d packages/*/); do
  echo ${i%%/};
  pushd ${i%%/}
  ./clean.sh
  popd
done