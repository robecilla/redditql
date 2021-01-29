import React from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import { Layout } from "../../../components/Layout";
import InputField from "../../../components/InputField";
import { Button, Flex } from "@chakra-ui/react";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useHandlePostFromQuery } from "../../../hooks/useHandlePostFromQuery";
import Error from "next/error";

type Props = {};

const EditPost: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [fetching, data] = useHandlePostFromQuery();
  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return <Layout>Loading...</Layout>;
  }

  if (!data.post) {
    return <Error statusCode={404} />;
  }

  const { id, title, content } = data.post;

  return (
    <Layout>
      <Formik
        initialValues={{ title, content }}
        onSubmit={async (values) => {
          await updatePost({
            id: Number(id),
            ...values,
          });
          await router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Title" placeholder="Be creative!" name="title" />
            <InputField
              textarea
              label="Content"
              placeholder="Your content here"
              name="content"
            />
            <Flex mt={4} align="center">
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                Update post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(EditPost);
