import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import React from "react";
import { Text, Flex, Heading, Box } from "@chakra-ui/react";
import Error from "next/error";
import UpdootSection from "../../components/UpdootSection";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const [{ data, fetching }] = usePostQuery({
    variables: { id: id as string },
  });

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
  return (
    <Layout>
      <Flex>
        <UpdootSection post={data.post} />
        <Box ml={4}>
          <Text fontSize="sm">
            Posted by {username} on {createdAt}
          </Text>
          <Heading mb={4}>{title}</Heading>
          <Text fontSize="md">{content}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
