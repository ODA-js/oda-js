"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const util_1 = require("util");
const reshape_1 = __importDefault(require("./reshape"));
const getData = graphql_tag_1.default `
  {
    peoples: people @_(get: "edges") {
      edges @_(each: { assign: "node" }) {
        cursor
        node @_(assign: ["homeworld", "species"]) {
          id
          name @_(trim: none)
          isLuke: name @_(isMatch: { match: "Luke", flags: "ig" })
          Name: name @_(match: { match: "Luke", flags: "ig" }, take: 0)
          species {
            sp_id: id
            spName: name
            classification
          }
          some @_(get: "notItHasHaving.atAll") {
            notItHasHaving {
              atAll
            }
          }
          homeworld {
            hw_id: id
            hwName: name
          }
        }
      }
    }
  }
`;
const data = {
    people: {
        edges: [
            {
                cursor: 'Y29ubmVjdGlvbi41OTllOTBhY2I0NjljNzNhOGU0MWRkMzQ=',
                node: {
                    id: 'UGVyc29uOjU5OWU5MGFjYjQ2OWM3M2E4ZTQxZGQzNA==',
                    name: '   Luke Skywalker   ',
                    species: {
                        spName: 'Just a Human being',
                        classification: null,
                    },
                    homeworld: {
                        hwName: 'Coruscant',
                    },
                },
            },
        ],
    },
};
const reverseData = graphql_tag_1.default `
  {
    people @_(dive: "people.edges") {
      cursor
      id @_(dive: "node.id")
      name @_(trim: none, dive: "node.name")
      hwName @_(dive: "node.homeworld.name")
      spName @_(dive: "node.species.name")
      classification @_(dive: "node.species.classification")
    }
  }
`;
const reverse = {
    people: [
        {
            cursor: 'Y29ubmVjdGlvbi41OTllOTBhY2I0NjljNzNhOGU0MWRkMzQ=',
            id: 'UGVyc29uOjU5OWU5MGFjYjQ2OWM3M2E4ZTQxZGQzNA==',
            name: '      Luke Skywalker   ',
            hwName: 'Coruscant',
            spName: 'Just a Human being',
            classification: null,
        },
    ],
};
const log = (doc, data) => {
    console.log(util_1.inspect(reshape_1.default(doc, data), { depth: 10 }));
};
log(getData, data);
log(reverseData, reverse);
//# sourceMappingURL=checkany.js.map