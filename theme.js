import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const COLORS = {
  text1: "#444b5a",

  bg1: "#3a4764",
  bg2: "#182034",
  bg3: "#232c43",

  keyBg1: "#637097",
  keyBg2: "#d03f2f",
};

const SIZES = {
  height,
  width,
};

export { COLORS, SIZES };
