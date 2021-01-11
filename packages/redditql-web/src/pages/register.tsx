import React from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { Button, Text, Flex } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import toError from "../utils/toError";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Link from "next/link";

type Props = {};

const Register: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
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
            <Flex mt={4} align="center">
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                Register
              </Button>
              <Text fontSize="xs">
                Already an user? Go ahead and <Link href="/login">login</Link>
              </Text>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
