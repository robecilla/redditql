import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}
