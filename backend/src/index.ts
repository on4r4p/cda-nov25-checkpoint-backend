import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
import { load } from "ts-dotenv";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { Country } from "./Entities/Country";
import { CountryResolver } from "./Resolvers/CountryResolver";

const env = load({
	PORT: {
		type: Number,
		default: 4000,
	},
});

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
		validate: true,
	});

	const server = new ApolloServer({
		schema,
	});

	const { url } = await startStandaloneServer(server, {
		listen: { port: env.PORT },
	});

	console.log(`GraphQL server ready at ${url}`);
}

startServer().catch((error) => {
	console.error("Failed to start application:", error);
	process.exit(1);
});
