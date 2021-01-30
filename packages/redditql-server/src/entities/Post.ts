import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Updoot } from "./Updoot";

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

  @Field(() => [Updoot])
  updoots?: Updoot[];

  @Field(() => User)
  author!: User;

  @Field()
  createdAt!: Date;
}
