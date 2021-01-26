import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { usePostsQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import UpdootSection from "../components/UpdootSection";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null });
  const [{ data }] = usePostsQuery({
    variables,
  });
  if (!data) return null;
  const {
    posts: { posts, hasMore },
  } = data;
  return (
    <Layout>
      {posts && (
        <>
          <Stack spacing={8}>
            {posts.map((post) => {
              const {
                id,
                title,
                contentExcerpt,
                author: { username },
              } = post;
              return (
                <Box key={id} p={5} shadow="md" borderWidth="1px">
                  <Flex>
                    <UpdootSection post={post} />
                    <Box ml={4}>
                      <Flex>
                        <NextLink href="/post/[id]" as={`/post/${id}`}>
                          <Link>
                            <Heading fontSize="xl">{title}</Heading>
                          </Link>
                        </NextLink>
                        <Text ml={4}>posted by {username}</Text>
                      </Flex>
                      <Text mt={4}>{contentExcerpt}</Text>
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </Stack>
          <br />
          {hasMore && (
            <Button
              onClick={() =>
                setVariables({
                  limit: variables.limit,
                  cursor: parseInt(posts[posts.length - 1].id),
                })
              }
            >
              Load more
            </Button>
          )}
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
