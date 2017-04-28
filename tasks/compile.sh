#!/usr/bin/env bash
for i in $(ls -d packages/*/); do
  echo ${i%%/};
  pushd ${i%%/}
  yarn
  ./compile.sh
  popd
done