import {
  Text,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Link,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

type Props = {};

const Navbar: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();
  if (fetching) return null;
  return (
    <Flex p={8} align="center">
      <Box>
        <NextLink href="/">
          <Link>
            <Heading size="lg">redditql</Heading>
          </Link>
        </NextLink>
      </Box>
      <Spacer />
      <NextLink href="/create-post">
        <Button colorScheme="teal" mr="4">
          Create post
        </Button>
      </NextLink>
      {data?.me && (
        <>
          <Text>{data.me.username}</Text>
          <Button
            ml={4}
            variant="link"
            colorScheme="black"
            onClick={async () => {
              await logout();
              router.reload();
            }}
          >
            Logout
          </Button>
        </>
      )}
      {!data?.me && (
        <Box>
          <NextLink href="/register">
            <Button colorScheme="teal" mr="4">
              Register
            </Button>
          </NextLink>
          <NextLink href="/login">
            <Button colorScheme="teal">Login</Button>
          </NextLink>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
