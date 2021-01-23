import React, { useState } from "react";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { usePostsQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

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
            {posts.map(
              ({ id, title, contentExcerpt, author: { username } }) => (
                <Box key={id} p={5} shadow="md" borderWidth="1px">
                  <Flex>
                    <Heading fontSize="xl">{title}</Heading>
                    <Text ml={4}>posted by {username}</Text>
                  </Flex>
                  <Text mt={4}>{contentExcerpt}</Text>
                </Box>
              )
            )}
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
