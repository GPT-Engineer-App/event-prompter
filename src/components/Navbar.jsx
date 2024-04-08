import { Box, Button, Heading, Flex, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="gray.100">
      <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
        The good promps
      </Heading>
      <Spacer />
      <Box>
        <Button onClick={onLogout}>Logout</Button>
      </Box>
    </Flex>
  );
};

export default Navbar;
