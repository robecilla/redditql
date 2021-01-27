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

  @FieldResolver(() => Boolean, { nullable: true })
  vote(@Root() root: Post, @Ctx() { req }: Context) {
    const { updoots } = root;
    return updoots.find((updoot) => updoot.userId === req.session.userId)?.vote;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async updoot(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req, prisma }: Context
  ) {
    const { userId } = req.session;
    await PostResolver.vote(prisma, userId, postId, true);

    return true;
  }

  private static async vote(
    prisma,
    userId: any,
    postId: number,
    vote: boolean
  ) {
    const updoot = await prisma.updoot.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (updoot && updoot.vote !== vote) {
      const updateUpdoot = prisma.updoot.update({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
        data: {
          vote,
        },
      });

      let updatePoints;
      if (vote) {
        updatePoints = prisma.$executeRaw`update "Post" set "points" = "points" + 2 where id = ${postId}`;
      } else {
        updatePoints = prisma.$executeRaw`update "Post" set "points" = "points" - 2 where id = ${postId}`;
      }

      await prisma.$transaction([updateUpdoot, updatePoints]);
    } else if (!updoot) {
      const createUpdoot = prisma.updoot.create({
        data: {
          userId,
          postId,
          vote,
        },
      });

      let updatePoints;
      if (vote) {
        updatePoints = prisma.$executeRaw`update "Post" set "points" = "points" + 1 where id = ${postId}`;
      } else {
        updatePoints = prisma.$executeRaw`update "Post" set "points" = "points" - 1 where id = ${postId}`;
      }
      await prisma.$transaction([createUpdoot, updatePoints]);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async downdoot(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req, prisma }: Context
  ) {
    const { userId } = req.session;
    await PostResolver.vote(prisma, userId, postId, false);

    return true;
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
        updoots: true,
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
      include: {
        author: true,
        updoots: true,
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deletePost(
    @Arg("id", () => ID) id: typeof ID,
    @Ctx() { req, prisma }: Context
  ) {
    const { userId } = req.session;

    // using raw query because prisma does no let me use where and
    return await prisma.$executeRaw<Post>`delete from "Post" where "id" = ${Number(
      id
    )} and "authorId" = ${userId}`;
  }
}
