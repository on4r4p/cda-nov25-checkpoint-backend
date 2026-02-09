import { Args, Mutation, Query, Resolver } from "type-graphql";
import { Country } from "../Entities/Country";
import { CountryCodeArgs } from "./CountryCodeArgs";
import { CreateCountryArgs } from "./CreateCountryArgs";

@Resolver(() => Country)
export class CountryResolver {
	@Mutation(() => Country)
	async addCountry(
		@Args() { code, name, emoji }: CreateCountryArgs,
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
	async country(@Args() { code }: CountryCodeArgs): Promise<Country | null> {
		return Country.findOneBy({ code: code.trim().toUpperCase() });
	}
}
