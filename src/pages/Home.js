import {
  Box,
  Button,
  Image,
  Flex,
  Text,
  Spinner,
  Heading,
  Center,
} from "@chakra-ui/react";
import { ArrowForwardIcon, DownloadIcon } from "@chakra-ui/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getData } from "../api";
import { PageNotFound } from "./PageNotFound";
import { saveAs } from "file-saver";

export const Home = () => {
  const queryClient = useQueryClient();

  const defaultDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (1 + currentDate.getMonth())).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
  };

  const [date, setDate] = useState(defaultDate());

  const {
    data: apodData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["apod", date],
    queryFn: () => getData(date),
  });
  const handlePreviousDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    const year = currentDate.getFullYear();
    const month = ("0" + (1 + currentDate.getMonth())).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    const previousDate = year + "-" + month + "-" + day;

    setDate(previousDate);
    queryClient.invalidateQueries(["apod", previousDate]); //캐시의 apod 무효화
  };

  const saveImage = () => {
    if (apodData && apodData.hdurl) {
      saveAs(apodData.hdurl, "image.jpg");
    }
  };

  return (
    <>
      <Box bg="#000" color="#fff" padding={"5"} h={"100vh"}>
        <Box textAlign="center" p={4}>
          <Heading
            fontWeight="bold"
            fontSize="5xl"
            textAlign={"left"}
            letterSpacing="-2"
          >
            WELCOME TO THE <br /> ASTRONOMY PICTURE OF THE DAY
          </Heading>
          <Flex
            alignItems={"center"}
            w="80vw"
            justifyContent={"space-between"}
            h="80vh"
          >
            {isError && (
              <>
                <PageNotFound />
              </>
            )}
            {isLoading ? (
              <Spinner />
            ) : (
              apodData && (
                <Box mt={8}>
                  <Flex
                    justifyContent={"space-between"}
                    w="68vw"
                    alignItems={"center"}
                  >
                    <Flex direction={"column"} align="flex-start" h="80vh">
                      <Text fontSize="2xl" fontWeight="bold" mb={"3"}>
                        {apodData.title}
                      </Text>
                      <Text fontSize="md" maxW="500" textAlign={"left"}>
                        {apodData.explanation}
                      </Text>
                    </Flex>
                    <Center>
                      <Image
                        src={
                          apodData.hdurl
                            ? apodData.hdurl
                            : "https://i.pinimg.com/originals/70/65/4f/70654fd75f2991e168ec22b75fdbd6a5.gif"
                        }
                        alt={apodData.title}
                        maxW="700"
                        maxH={"80vh"}
                        overflow="hidden"
                        // m={4}
                      />
                    </Center>
                    <Button onClick={saveImage} ml="3">
                      <DownloadIcon />
                    </Button>
                  </Flex>
                </Box>
              )
            )}
            <Flex justify="flex-end" mt={8}>
              <Button
                onClick={handlePreviousDay}
                colorScheme="gray"
                variant="outline"
              >
                <ArrowForwardIcon color={"#Fff"} />
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
