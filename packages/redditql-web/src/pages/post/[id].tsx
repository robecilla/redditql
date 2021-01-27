import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import React from "react";
import { Text, Flex, Heading, Box, IconButton } from "@chakra-ui/react";
import Error from "next/error";
import UpdootSection from "../../components/UpdootSection";
import { DeleteIcon } from "@chakra-ui/icons";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const [
    {
      data: { me },
    },
  ] = useMeQuery();
  const [{ data, fetching }] = usePostQuery({
    variables: { id: id as string },
  });
  const [, deletePost] = useDeletePostMutation();

  if (fetching) {
    return <Layout>Loading...</Layout>;
  }

  if (!data.post) {
    return <Error statusCode={404} />;
  }

  const {
    post: {
      id: postId,
      title,
      content,
      author: { id: authorId, username },
      points,
      vote,
      createdAt,
    },
  } = data;

  const postBelongsToUser = me.id === authorId;

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
              <IconButton
                ml="auto"
                colorScheme="red"
                icon={<DeleteIcon />}
                aria-label="Delete post"
                onClick={async () => {
                  await deletePost({ id: postId });
                  await router.push("/");
                }}
              />
            )}
          </Flex>
          <Text fontSize="md">{content}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
