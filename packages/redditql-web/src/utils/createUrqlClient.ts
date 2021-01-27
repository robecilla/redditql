import {
  dedupExchange,
  Exchange,
  fetchExchange,
  gql,
  stringifyVariables,
} from "urql";
import { cacheExchange, Resolver, Variables } from "@urql/exchange-graphcache";
import {
  DeletePostMutationVariables,
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  UpdootMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
import { isServer } from "./isServer";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;

    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );

    info.partial = !isItInTheCache;

    const results: string[] = [];
    let hasMore = true;

    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const posts = cache.resolve(key, "posts") as string[];
      if (!cache.resolve(key, "hasMore")) {
        hasMore = false;
      }
      results.push(...posts);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

function vote(args: UpdootMutationVariables, cache, vote: boolean) {
  const { postId } = args;
  const data = cache.readFragment(
    gql`
      fragment _ on Post {
        id
        points
        vote
      }
    `,
    { id: postId }
  );
  if (data) {
    if (data.vote === vote) return;
    const hasVote = data.vote !== null;
    const newPoints = vote
      ? (data.points as number) + (!hasVote ? 1 : 2)
      : (data.points as number) - (!hasVote ? 1 : 2);
    cache.writeFragment(
      gql`
        fragment _ on Post {
          id
          points
          vote
        }
      `,
      { id: postId, points: newPoints, vote }
    );
  }
}

export const createUrqlClient = (ssrExchange, ctx) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
    // forward cookie from browser to graphql server
    headers: isServer()
      ? {
          cookie: ctx.req.headers.cookie,
        }
      : undefined,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          deletePost: (_result, args, cache) => {
            const { id } = args as DeletePostMutationVariables;
            cache.invalidate({ __typename: "Post", id });
          },
          updoot: (_result, args, cache) => vote(args, cache, true),
          downdoot: (_result, args, cache) => vote(args, cache, false),
          createPost: (_result, args, cache) => {
            cache
              .inspectFields("Query")
              .filter((info) => info.fieldName === "posts")
              .forEach((fi) =>
                cache.invalidate("Query", "posts", fi.arguments)
              );
          },
          logout: (_result, args, cache) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              () => ({
                me: null,
              })
            );
          },
          login: (_result, args, cache) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
