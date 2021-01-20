import React, { useState } from "react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Alert, AlertDescription, Button, Flex, Link } from "@chakra-ui/react";
import { useForgotPasswordMutation } from "../generated/graphql";
import { Layout } from "../components/Layout";

const ForgotPassword: React.FC = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return complete ? (
    <Alert status="success">
      <AlertDescription>
        If an account with this email address exists, we've sent you an email
      </AlertDescription>
    </Alert>
  ) : (
    <Layout>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Email"
              placeholder="Type your email"
              name="email"
            />
            <Flex mt={4} align="center">
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                Send me a link
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
