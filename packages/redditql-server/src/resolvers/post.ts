import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { Context } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { prisma }: Context): Promise<Post[]> {
    return prisma.post.findMany();
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => ID) id: typeof ID,
    @Ctx() { prisma }: Context
  ): Promise<Post | null> {
    return prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  @Mutation(() => Post)
  createPost(
    @Arg("title") title: string,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.create({
      data: { title },
    });
  }

  @Mutation(() => Post)
  updatePost(
    @Arg("id", () => ID) id: typeof ID,
    @Arg("title") title: string,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.update({
      where: { id: Number(id) },
      data: { title },
    });
  }

  @Mutation(() => Post)
  deletePost(
    @Arg("id", () => ID) id: typeof ID,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.delete({
      where: { id: Number(id) },
    });
  }
}
