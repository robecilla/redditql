import { ObjectType, Field, ID } from "type-graphql";
import { Post } from "./Post";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field(() => [Post])
  posts?: Post[];
}
