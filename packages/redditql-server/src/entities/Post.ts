import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Post {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  content!: string;

  @Field()
  points!: number;

  @Field()
  author!: User;
}
