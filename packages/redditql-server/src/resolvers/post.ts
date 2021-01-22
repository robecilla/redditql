import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
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

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  contentExcerpt(@Root() root: Post) {
    const { content } = root;
    const limit = 200; // characters
    return content.length > limit
      ? `${content.substring(0, limit)}...`
      : content;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Int, { nullable: true }) cursor: number | null,
    @Ctx() { prisma }: Context
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const query = {
      take: realLimitPlusOne, // cap at 50 max results
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    };

    if (cursor) {
      Object.assign(query, {
        cursor: { id: cursor },
      });
    }

    const posts = await prisma.post.findMany(query);

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
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
