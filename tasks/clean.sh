#!/usr/bin/env bash
rm -fr node_modules
rm -fr sinopia/storage
for i in $(ls -d packages/*/); do
  echo ${i%%/};
  pushd ${i%%/}
  ./clean.sh
  popd
done