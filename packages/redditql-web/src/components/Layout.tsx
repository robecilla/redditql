import React from "react";
import Navbar from "./Navbar";
import { Box, Center } from "@chakra-ui/react";

export const Layout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Center>
        <Box w={800}>{children}</Box>
      </Center>
    </>
  );
};
