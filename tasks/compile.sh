#!/usr/bin/env bash
list=(oda-isomorfic oda-gen-common
oda-model
oda-api-graphql oda-api-common 
oda-api-graphql-dynamodb 
oda-api-graphql-mongoose 
oda-api-graphql-sequelize 
oda-gen-graphql 
oda-lodash 
oda-ra-data-provider 
oda-ra-ui)

for i in ${list[*]}; do
  echo ${i%%/};
  pushd packages/${i%%/}
  npm i
  popd
done