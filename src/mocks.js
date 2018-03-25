import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import typeDefs from "./schema.graphql";

const mocks = {
  Query: () => ({
    ownedEvents: () => [
      { id: "foo", title: "Blah", startingTime: '12 March', description: "This is the event description" },
      { id: "bar", accessToken: "secret", startingTime: '12 March', description: "This is the event description", title: "Blah2" }
      // { id: "jj", title: "ss" },
      // { id: "hv", accessToken: "secret", title: "gg" },
      // { id: "fr55ssf", title: "wowowowowoowowowow dogggggeee expo" },
      // { id: "hv", accessToken: "secret", title: "gg" }
    ],
    joinedEvents: () => [
      { id: "foo", title: "Blah", startingTime: '12 March', description: "This is the event description", },
      { id: "bar", accessToken: "secret", startingTime: '12 March', description: "This is the event description", title: "Blah2" }
      // { id: "jj", title: "ss" },
      // { id: "hv", accessToken: "secret", title: "gg" },
      // { id: "344", title: "wowowowowoowowowow dogggggeee expo" },
      // { id: "aad", title: "sorrrry dogggggeee expo" }
    ],
    event: () => ({
      id: "foo",
      title: "blah",
      requests: [],
      stream: "6e4c9b1f-1ab2-4616-af73-d84f4180b624",
      session: {
        id:
          "1_MX40NjA4Njk4Mn5-MTUyMTk0MTUwNTAzOX5wbnZNYUJ0NmtaNzk3Sk5mT243UTRMeVh-fg",
        accessToken:
          "T1==cGFydG5lcl9pZD00NjA4Njk4MiZzaWc9MDRiOTNkYjVhMDJjYTU3YmQ0N2Y2YTI0ZTQ1Zjk5NzJiZjc3YzlmNzpzZXNzaW9uX2lkPTFfTVg0ME5qQTROams0TW41LU1UVXlNVGswTVRVd05UQXpPWDV3Ym5aTllVSjBObXRhTnprM1NrNW1UMjQzVVRSTWVWaC1mZyZjcmVhdGVfdGltZT0xNTIxOTQxNTI2Jm5vbmNlPTAuMTIxMjc3MTU0NzU4MjMzMiZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNTIyNTQ2MzI1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9"
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
