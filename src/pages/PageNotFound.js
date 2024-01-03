import { Box, Image, Center, Text, Flex } from "@chakra-ui/react";

export const PageNotFound = () => {
  return (
    <Box>
      <Center h={"80vh"}>
        <Flex flexDirection={"column"}>
          <Image
            src="https://i.pinimg.com/564x/2c/58/5d/2c585d93d27357807f076d94949df950.jpg"
            alt="not found image"
          />
          <Text fontSize="1xl">
            Today's information has not been updated yet.
          </Text>
        </Flex>
      </Center>
    </Box>
  );
};
