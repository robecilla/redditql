import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { Context } from "../types";
import { isAuthenticated } from "../middleware/isAuthenticated";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  content: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Int, { nullable: true }) cursor: number | null,
    @Ctx() { prisma }: Context
  ): Promise<Post[]> {
    const query = {
      take: Math.min(50, limit), // cap at 50 max results
      orderBy: {
        createdAt: "desc",
      },
    };

    if (cursor) {
      Object.assign(query, {
        cursor: { id: cursor },
      });
    }

    return prisma.post.findMany(query);
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
  @UseMiddleware(isAuthenticated)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() { prisma, req }: Context
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        ...input,
        author: { connect: { id: parseInt(req.session.userId) } },
      },
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
