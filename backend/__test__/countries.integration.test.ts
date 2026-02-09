import { ApolloServer } from "@apollo/server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { Country } from "../src/Entities/Country";
import { CountryResolver } from "../src/Resolvers/CountryResolver";

describe("Countries API integration", () => {
	let db: DataSource;
	let server: ApolloServer;

	beforeAll(async () => {
		db = new DataSource({
			type: "sqlite",
			database: ":memory:",
			entities: [Country],
			synchronize: true,
			dropSchema: true,
			logging: false,
		});
		await db.initialize();

		const schema = await buildSchema({
			resolvers: [CountryResolver],
			validate: true,
		});

		server = new ApolloServer({ schema });
	});

	beforeEach(async () => {
		await db.synchronize(true);
		await Country.save([
			{ code: "FR", name: "France", emoji: "🇫🇷" },
			{ code: "BE", name: "Belgique", emoji: "🇧🇪" },
		]);
	});

	afterAll(async () => {
		await db.destroy();
	});

	it("reads countries list from GraphQL API", async () => {
		const response = await server.executeOperation({
			query: `
				query {
					countries {
						code
						name
						emoji
					}
				}
			`,
		});

		expect(response.body.kind).toBe("single");
		if (response.body.kind !== "single") {
			throw new Error("Unexpected multipart GraphQL response");
		}

		expect(response.body.singleResult.errors).toBeUndefined();
		expect(response.body.singleResult.data).toEqual({
			countries: [
				{ code: "BE", name: "Belgique", emoji: "🇧🇪" },
				{ code: "FR", name: "France", emoji: "🇫🇷" },
			],
		});
	});
});
