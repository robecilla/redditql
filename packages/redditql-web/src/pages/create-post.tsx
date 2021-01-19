import React from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Button, Flex } from "@chakra-ui/react";
import { useCreatePostMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../hooks/useIsAuth";

type Props = {};

const CreatePost: React.FC<Props> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", content: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({ input: values });
          !error && (await router.push("/"));
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
                Create post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
