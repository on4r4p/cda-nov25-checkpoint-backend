import { ApolloServer } from "@apollo/server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Country } from "../src/Entities/Country";
import { CountryResolver } from "../src/Resolvers/CountryResolver";
import { clearDB, db } from "../src/db/reset";

describe("Country mutation integration (real sqlite DB)", () => {
	let server: ApolloServer;

	beforeAll(async () => {
		const schema = await buildSchema({
			resolvers: [CountryResolver],
			validate: true,
		});

		server = new ApolloServer({ schema });
	});

	beforeEach(async () => {
		await clearDB();
	});

	afterAll(async () => {
		await clearDB();
		if (db.isInitialized) {
			await db.destroy();
		}
	});

	it("creates a country in database via addCountry mutation", async () => {
		const response = await server.executeOperation({
			query: `
				mutation AddCountry($code: String!, $name: String!, $emoji: String!) {
					addCountry(code: $code, name: $name, emoji: $emoji) {
						code
						name
						emoji
					}
				}
			`,
			variables: {
				code: "fr",
				name: "France",
				emoji: "🇫🇷",
			},
		});

		expect(response.body.kind).toBe("single");
		if (response.body.kind !== "single") {
			throw new Error("Unexpected multipart GraphQL response");
		}

		expect(response.body.singleResult.errors).toBeUndefined();
		expect(response.body.singleResult.data).toEqual({
			addCountry: {
				code: "FR",
				name: "France",
				emoji: "🇫🇷",
			},
		});

		const countryInDB = await Country.findOneBy({ code: "FR" });
		expect(countryInDB).not.toBeNull();
		expect(countryInDB).toMatchObject({
			code: "FR",
			name: "France",
			emoji: "🇫🇷",
		});
	});
});
