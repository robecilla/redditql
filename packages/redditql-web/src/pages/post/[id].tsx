import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { useDeletePostMutation, usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import React from "react";
import { Text, Flex, Heading, Box, IconButton } from "@chakra-ui/react";
import Error from "next/error";
import UpdootSection from "../../components/UpdootSection";
import { DeleteIcon } from "@chakra-ui/icons";
import { useHandlePostFromQuery } from "../../hooks/useHandlePostFromQuery";
import NextLink from "next/link";

const Post = () => {
  const router = useRouter();

  const [fetching, data, postBelongsToUser] = useHandlePostFromQuery();
  const [, deletePost] = useDeletePostMutation();

  if (fetching) {
    return <Layout>Loading...</Layout>;
  }

  if (!data.post) {
    return <Error statusCode={404} />;
  }

  const {
    id,
    title,
    content,
    author: { username },
    createdAt,
  } = data.post;

  return (
    <Layout>
      <Flex>
        <UpdootSection post={data.post} />
        <Box ml={4}>
          <Text fontSize="sm">
            Posted by {username} on {createdAt}
          </Text>
          <Flex>
            <Heading mb={4}>{title}</Heading>
            {postBelongsToUser && (
              <Box ml="auto">
                <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                  <IconButton
                    colorScheme="blue"
                    icon={<DeleteIcon />}
                    aria-label="Update post"
                  />
                </NextLink>
                <IconButton
                  ml="auto"
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  aria-label="Delete post"
                  onClick={async () => {
                    await deletePost({ id: Number(id) });
                    await router.push("/");
                  }}
                />
              </Box>
            )}
          </Flex>
          <Text fontSize="md">{content}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
