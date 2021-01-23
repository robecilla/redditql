import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Post } from "./Post";

@ObjectType()
export class Updoot {
  @Field()
  vote!: number;

  @Field(() => ID)
  userId!: number;

  @Field(() => User)
  user!: User;

  @Field(() => ID)
  postId!: number;

  @Field(() => Post)
  post!: Post;

  @Field()
  createdAt: string;
}
