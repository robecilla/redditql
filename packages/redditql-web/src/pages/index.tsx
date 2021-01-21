import React, { useState } from "react";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { usePostsQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null });
  const [
    {
      data: {
        posts: { posts, hasMore },
      },
    },
  ] = usePostsQuery({
    variables,
  });

  return (
    <Layout>
      {posts && (
        <>
          <Stack spacing={8}>
            {posts.map(({ id, title, contentExcerpt }) => (
              <Box key={id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{title}</Heading>
                <Text mt={4}>{contentExcerpt}</Text>
              </Box>
            ))}
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
