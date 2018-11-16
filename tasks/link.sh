#!/usr/bin/env bash
for i in $(ls -d packages/*/); do
  echo ${i%%/};
  pushd ${i%%/}
  yarn link
  if [ -f link.sh ]; then ./link.sh; fi
  popd
done