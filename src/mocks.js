import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import typeDefs from "./schema.graphql";

const mocks = {
  Query: () => ({
    ownedEvents: () => [
      { id: "foo", title: "Blah" },
      // { id: "bar", accessToken: "secret", title: "Blah2" },
      // { id: "jj", title: "ss" },
      // { id: "hv", accessToken: "secret", title: "gg" },
      // { id: "fr55ssf", title: "wowowowowoowowowow dogggggeee expo" },
      // { id: "hv", accessToken: "secret", title: "gg" }
    ],
    joinedEvents: () => [
      { id: "foo", title: "Blah" },
      { id: "bar", accessToken: "secret", title: "Blah2" },
      // { id: "jj", title: "ss" },
      // { id: "hv", accessToken: "secret", title: "gg" },
      // { id: "344", title: "wowowowowoowowowow dogggggeee expo" },
      // { id: "aad", title: "sorrrry dogggggeee expo" }
    ],
    event: () => ({
      id: "foo",
      title: "blah",
      session: {
        stream: "5e2f3959-02ef-4a20-81e0-39de75b52968",
        id:
          "1_MX40NjA4Njk4Mn5-MTUyMTk0MTUwNTAzOX5wbnZNYUJ0NmtaNzk3Sk5mT243UTRMeVh-fg",
        accessToken:
          "T1==cGFydG5lcl9pZD00NjA4Njk4MiZzaWc9NDRiNzRmNmQyYzA4ZjU3YzBmZTQ1MzZkYjEyNWY1N2ZhNDNlNmRlNTpzZXNzaW9uX2lkPTFfTVg0ME5qQTROams0TW41LU1UVXlNVGswTVRVd05UQXpPWDV3Ym5aTllVSjBObXRhTnprM1NrNW1UMjQzVVRSTWVWaC1mZyZjcmVhdGVfdGltZT0xNTIxOTQxNzM2Jm5vbmNlPTAuOTUxNzYzMTc1ODc1NDIxOSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTIyNTQ2NTM2JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9"
      }
    })
  }),
  Mutation: () => ({
    startEvent: () => {},
    endEvent: () => {},
    requestToStream: () => {}
  })
};

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ mocks, schema });

export const mockLink = new SchemaLink({ schema });
