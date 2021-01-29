import { useRouter } from "next/router";
import { PostQuery, useMeQuery, usePostQuery } from "../generated/graphql";
import React from "react";

export const useHandlePostFromQuery = (): [
  fetching: boolean,
  data: PostQuery,
  postBelongsToUser: boolean
] => {
  const [{ data: me }] = useMeQuery();

  const router = useRouter();
  const { id } = router.query;

  const [{ data, fetching }] = usePostQuery({
    variables: { id: id as string },
  });

  const postBelongsToUser = me?.me?.id === data?.post?.author.id;

  return [fetching, data, postBelongsToUser];
};
