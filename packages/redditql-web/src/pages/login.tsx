import React from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Button, Text, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import toError from "../utils/toError";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

type Props = {};

const Login: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Layout>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data.login.errors) {
            setErrors(toError(response.data.login.errors));
          } else if (response.data.login.user) {
            await router.push((router.query.redirect as string) || "/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Username or email"
              placeholder="Type your username or email"
              name="usernameOrEmail"
            />
            <InputField
              label="Password"
              placeholder="Type your password"
              name="password"
              type="password"
            />
            <Flex mt={4} align="center">
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                Login
              </Button>
              <Text ml="auto" fontSize="xs">
                <NextLink href="/forgot-password">
                  <Link>Forgot password?</Link>
                </NextLink>
              </Text>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
