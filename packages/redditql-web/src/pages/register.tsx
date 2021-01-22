import React from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Button, Text, Flex } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import toError from "../utils/toError";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Link from "next/link";
import { Layout } from "../components/Layout";

type Props = {};

const Register: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Layout>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data.register.errors) {
            setErrors(toError(response.data.register.errors));
          } else if (response.data.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Username"
              placeholder="Type your username"
              name="username"
            />
            <InputField
              label="Email"
              placeholder="Type your email"
              name="email"
              type="email"
            />
            <InputField
              label="Password"
              placeholder="Type your password"
              name="password"
              type="password"
            />
            <br />
            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
              isFullWidth
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
