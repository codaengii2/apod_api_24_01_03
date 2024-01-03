import { extendTheme, theme as chakraTheme } from "@chakra-ui/react";

const { Button } = chakraTheme.components;

const components = {
  Button,
};

export const _theme = extendTheme({
  components,
  fonts: {
    heading: `'Open Sans', sans-serif`, //제목
    body: `'Raleway', sans-serif`, //본문
  },
});
