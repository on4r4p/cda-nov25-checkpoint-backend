import { IsNotEmpty, Length, Matches } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CreateCountryArgs {
	@Field()
	@Length(2, 3)
	@Matches(/^[A-Za-z]{2,3}$/, {
		message: "code must contain only letters (2 or 3 characters)",
	})
	code!: string;

	@Field()
	@IsNotEmpty()
	@Length(2, 100)
	name!: string;

	@Field()
	@IsNotEmpty()
	@Length(1, 8)
	emoji!: string;
}
