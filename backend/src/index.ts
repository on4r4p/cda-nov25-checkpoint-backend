import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { Country } from "./Entities/Country";
import { CountryResolver } from "./Resolvers/CountryResolver";

export const db = new DataSource({
	type: "sqlite",
	database: "database.sqlite",
	entities: [Country],
	synchronize: true,
	logging: false,
});

async function startServer(): Promise<void> {
	await db.initialize();

	const schema = await buildSchema({
		resolvers: [CountryResolver],
		validate: false,
	});

	const server = new ApolloServer({
		schema,
	});

	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
	});

	console.log(`GraphQL server ready at ${url}`);
}

startServer().catch((error) => {
	console.error("Failed to start application:", error);
	process.exit(1);
});
