import gql from "graphql-tag";
import { inspect } from "util";

import reshape from "./reshape";

const getData = gql`
   {
     peoples:people @_(get:"edges") {
      edges @_(each:{assign:"node"}) {
        cursor
        node @_(assign:["homeworld","species"]){
          id
          name @_( trim: none )
          isLuke: name @_(isMatch:{match:"Luke", flags:"ig"})
          Name: name @_(match:{match:"Luke", flags:"ig"}, take:0)
          species {
            sp_id:id
            spName: name
            classification
          }
          some @_(get:"notItHasHaving.atAll"){
            notItHasHaving{
              atAll
            }
          }
          homeworld{
            hw_id: id
            hwName: name
          }
        }
      }
    }
  }
`;

const data = {
  "people": {
    "edges": [
      {
        "cursor": "Y29ubmVjdGlvbi41OTllOTBhY2I0NjljNzNhOGU0MWRkMzQ=",
        "node": {
          "id": "UGVyc29uOjU5OWU5MGFjYjQ2OWM3M2E4ZTQxZGQzNA==",
          "name": "   Luke Skywalker   ",
          "species": {
            "spName": "Just a Human being",
            "classification": null,
          },
          "homeworld": {
            "hwName": "Coruscant",
          },
        },
      },
    ],
  },
};

const reverseData = gql`
  {
    people @_(dive:"people.edges"){
      cursor
      id  @_(dive:"node.id")
      name @_(trim: none dive:"node.name")
      hwName @_(dive:"node.homeworld.name")
      spName @_(dive:"node.species.name")
      classification @_(dive:"node.species.classification")
    }
  }
`;

const reverse = {
  "people": [
    {
      "cursor": "Y29ubmVjdGlvbi41OTllOTBhY2I0NjljNzNhOGU0MWRkMzQ=",
      "id": "UGVyc29uOjU5OWU5MGFjYjQ2OWM3M2E4ZTQxZGQzNA==",
      "name": "      Luke Skywalker   ",
      "hwName": "Coruscant",
      "spName": "Just a Human being",
      "classification": null,
    },
  ],
};

const log = (doc, data) => {
  console.log(inspect(reshape(doc, data), { depth: 10 }));
};

log(getData, data);

log(reverseData, reverse);
