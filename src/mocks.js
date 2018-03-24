import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import typeDefs from "./schema.graphql";

console.log(typeDefs);

const mocks = {
  Query: () => ({
    events: () => []
  })
};

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ mocks, schema });

export const mockLink = new SchemaLink({ schema });
