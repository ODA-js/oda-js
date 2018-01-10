#!/usr/bin/env bash
for i in $(ls -d packages/*/); do
  echo ${i%%/};
  pushd ${i%%/}
  npm i 
  ./compile.sh
  popd
done