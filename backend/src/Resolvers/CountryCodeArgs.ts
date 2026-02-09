import { Length, Matches } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CountryCodeArgs {
	@Field()
	@Length(2, 3)
	@Matches(/^[A-Za-z]{2,3}$/, {
		message: "code must contain only letters (2 or 3 characters)",
	})
	code!: string;
}
