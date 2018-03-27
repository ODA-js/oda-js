#!/usr/bin/env bash
rm -rf node_modules
rm -rf sinopia/storage
for i in $(ls -d packages/*/); do
  echo ${i%%/};
  pushd ${i%%/}
  ./clean.sh
  popd
done