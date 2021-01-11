import { Text, Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

type Props = {};

const Navbar: React.FC<Props> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();
  if (fetching) return null;
  return (
    <Flex p={8} align="center">
      <Box>
        <Link href="/">
          <Heading size="md">redditql</Heading>
        </Link>
      </Box>
      <Spacer />
      {data?.me && (
        <>
          <Text>{data.me.username}</Text>
          <Button
            ml={4}
            variant="link"
            colorScheme="black"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </>
      )}
      {!data?.me && (
        <Box>
          <Link href="/register">
            <Button colorScheme="teal" mr="4">
              Register
            </Button>
          </Link>
          <Link href="/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
