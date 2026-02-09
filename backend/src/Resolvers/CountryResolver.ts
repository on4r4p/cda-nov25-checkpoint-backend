import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Country } from "../entities/Country";

@Resolver(() => Country)
export class CountryResolver {
	@Mutation(() => Country)
	async addCountry(
		@Arg("code") code: string,
		@Arg("name") name: string,
		@Arg("emoji") emoji: string,
	): Promise<Country> {
		const normalizedCode = code.trim().toUpperCase();

		const existingCountry = await Country.findOneBy({ code: normalizedCode });
		if (existingCountry) {
			throw new Error(`Country with code "${normalizedCode}" already exists`);
		}

		const country = Country.create({
			code: normalizedCode,
			name: name.trim(),
			emoji: emoji.trim(),
		});

		return country.save();
	}

	@Query(() => [Country])
	async countries(): Promise<Country[]> {
		return Country.find({
			order: {
				name: "ASC",
			},
		});
	}

	@Query(() => Country, { nullable: true })
	async country(@Arg("code") code: string): Promise<Country | null> {
		return Country.findOneBy({ code: code.trim().toUpperCase() });
	}
}
