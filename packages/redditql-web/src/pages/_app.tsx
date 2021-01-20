import { ChakraProvider } from "@chakra-ui/react";

function redditql({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default redditql;
