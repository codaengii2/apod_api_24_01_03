import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.nasa.gov/planetary/",
  params: {
    api_key: "lHV0iZvrn8N14hA5wrjzpdzYPeKzFgI1CccfzAlG",
  },
});

export const getData = async (date) => {
  try {
    const response = await instance.get(`apod?date=${date}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching APOD data");
  }
};
