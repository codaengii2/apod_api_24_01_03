import {
  Box,
  Button,
  Image,
  Flex,
  Text,
  Spinner,
  Heading,
  Center,
  AspectRatio,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  DownloadIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
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
  const handleNextDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = ("0" + (1 + currentDate.getMonth())).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    const nextDate = year + "-" + month + "-" + day;

    setDate(nextDate);
    queryClient.invalidateQueries(["apod", nextDate]); //캐시의 apod 무효화
  };

  // console.log(apodData);
  const saveImage = () => {
    if (apodData && apodData.hdurl) {
      saveAs(apodData.hdurl, "image.jpg");
    }
  };
  return (
    <>
      <Box bg="#000" color="#fff" padding={"5"} h={"100vh"}>
        <Heading
          fontWeight="bold"
          fontSize="5xl"
          textAlign={"left"}
          letterSpacing="-2"
        >
          WELCOME TO THE <br /> ASTRONOMY PICTURE OF THE DAY
        </Heading>

        <Box textAlign="center" p={4}>
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
                    w="70vw"
                    alignItems={"center"}
                  >
                    <Flex direction={"column"} align="flex-start" h="80vh">
                      <Text fontSize="2xl" fontWeight="bold">
                        {apodData.title}
                      </Text>
                      <Text
                        fontSize="md"
                        maxW="500"
                        textAlign={"left"}
                        mt="3"
                        mb="3"
                      >
                        {apodData.explanation}
                      </Text>
                      <Text fontSize={"2xl"} fontWeight="bold">
                        {apodData.date}
                      </Text>
                    </Flex>

                    <Center>
                      {apodData.media_type === "image" ? (
                        <Image
                          src={apodData.url}
                          alt={apodData.title}
                          maxW="700"
                          maxH={"80vh"}
                          overflow="hidden"
                          ml={4}
                        />
                      ) : apodData.media_type === "video" ? (
                        <AspectRatio w={700} ratio={1} maxH={"80vh"}>
                          <iframe
                            title="video"
                            src={apodData.url}
                            allowFullScreen
                          ></iframe>
                        </AspectRatio>
                      ) : (
                        <Image
                          src={
                            "https://i.pinimg.com/originals/7b/bf/81/7bbf813292b6cd4e5835155661aea32d.gif"
                          }
                          alt={"no Data"}
                          maxW="700"
                          maxH={"80vh"}
                          overflow="hidden"
                          ml={4}
                        />
                      )}
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
                mr={"2"}
                _hover={{
                  bg: "#fff",
                  "& svg": {
                    color: "#000",
                  },
                }}
              >
                <ArrowBackIcon color={"#fff"} />
              </Button>
              <Button
                onClick={handleNextDay}
                colorScheme="gray"
                variant="outline"
                _hover={{
                  bg: "#fff",
                  "& svg": {
                    color: "#000",
                  },
                }}
              >
                <ArrowForwardIcon color={"#fff"} />
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
