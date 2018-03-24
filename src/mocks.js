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
    event: () => ({ id: "foo" })
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
