import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Post {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;
}
