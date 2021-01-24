import { Box, Flex, IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import React from "react";
import {
  PostChunkFragment,
  useDowndootMutation,
  useUpdootMutation,
} from "../generated/graphql";

type Props = {
  post: PostChunkFragment;
};

const UpdootSection: React.FC<Props> = ({ post: { id, points, vote } }) => {
  const [, updoot] = useUpdootMutation();
  const [, downdoot] = useDowndootMutation();

  const isUpdoot = vote === true;
  const isDowndoot = vote === false;

  return (
    <Flex direction="column" align="center">
      <IconButton
        onClick={() => {
          if (isUpdoot) return;
          updoot({ postId: parseInt(id) });
        }}
        size="sm"
        colorScheme={isUpdoot ? "green" : undefined}
        aria-label="upVote"
        icon={<TriangleUpIcon />}
      />
      <Box p={4}>{points}</Box>
      <IconButton
        onClick={() => {
          if (isDowndoot) return;
          downdoot({ postId: parseInt(id) });
        }}
        size="sm"
        colorScheme={isDowndoot ? "red" : undefined}
        aria-label="downVote"
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};

export default UpdootSection;
