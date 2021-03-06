import React, { useState } from "react";
import { Form, Formik } from "formik";
import toError from "../../utils/toError";
import InputField from "../../components/InputField";
import { Alert, AlertDescription, Button, Flex, Link } from "@chakra-ui/react";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../../components/Layout";

const ChangePassword = () => {
  const router = useRouter();
  const token = router.query.token as string;
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Layout>
      {tokenError && (
        <Alert status="error">
          <AlertDescription>
            {tokenError}.{" "}
            <NextLink href="/forgot-password">
              <Link>Request a new one</Link>
            </NextLink>
          </AlertDescription>
        </Alert>
      )}
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async ({ newPassword }, { setErrors }) => {
          const response = await changePassword({ token, newPassword });
          if (response.data.changePassword.errors) {
            const errors = toError(response.data.changePassword.errors);
            if ("token" in errors) {
              setTokenError(errors.token);
            }
            setErrors(errors);
          } else if (response.data.changePassword.user) {
            await router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="New password"
              placeholder="Type your new password"
              name="newPassword"
              type="password"
            />
            <Flex mt={4} align="center">
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                Change password
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
