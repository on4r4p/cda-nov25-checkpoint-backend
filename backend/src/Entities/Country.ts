import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	PrimaryColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Country extends BaseEntity {
	@Field()
	@PrimaryColumn({ length: 3 })
	code!: string;

	@Field()
	@Column()
	name!: string;

	@Field()
	@Column()
	emoji!: string;
}
