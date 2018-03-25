import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import typeDefs from "./schema.graphql";

const mocks = {
  Query: () => ({
    ownedEvents: () => [
      { id: "foo", title: "Blah" },
      { id: "bar", accessToken: "secret", title: "Blah2" }
    ],
    joinedEvents: () => [
      { id: "foo", title: "Blah" },
      { id: "bar", accessToken: "secret", title: "Blah2" }
    ],
    event: () => ({
      id: "foo",
      title: "blah",
      session: {
        stream: "6e4c9b1f-1ab2-4616-af73-d84f4180b624",
        sessionId:
          "2_MX40NjA4Njk4Mn5-MTUyMTkzNzE5OTY2OX5RMmlKTlA3azE0L3dLWEE5eVlqOWpIdlh-fg",
        accessToken:
          "T1==cGFydG5lcl9pZD00NjA4Njk4MiZzaWc9Nzc5MGZmYzViMzMwMGQ5MThhYjk4ODBiYzA3MDVhY2NkODRkY2I5YTpzZXNzaW9uX2lkPTJfTVg0ME5qQTROams0TW41LU1UVXlNVGt6TnpFNU9UWTJPWDVSTW1sS1RsQTNhekUwTDNkTFdFRTVlVmxxT1dwSWRsaC1mZyZjcmVhdGVfdGltZT0xNTIxOTM3MjIwJm5vbmNlPTAuMjY1NzEzMDI5NjI3OTUxNSZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNTIxOTQwODE5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9"
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
