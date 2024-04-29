import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Clipboard,
} from "react-native";
import { useEffect, useState } from "react";

import { COLORS, SIZES } from "./theme";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [values, setValues] = useState({
    value1: "0",
    value2: "",
    operand: "",
    answer: "0",
  });

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    "semi-bold": require("./assets/fonts/semi-bold.ttf"),
    bold: require("./assets/fonts/bold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          setIsAppReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!isAppReady) return null;

  const buttons = [
    "7",
    "8",
    "9",
    "del",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "-",
    ".",
    "0",
    "/",
    "*",
  ];
  const operators = ["+", "-", "/", "*"];
  const funcs = ["del", "=", "reset"];

  function handlePress(key) {
    const { value1, value2, operand, answer } = values;

    const isOperator = operators.some((operand) => operand === key);
    const isFuncs = funcs.some((func) => func === key);

    if (!isOperator && !isFuncs) {
      if (!operand) {
        if (key === "." && answer.includes(".")) return true;

        if (key !== "." && answer === "0") {
          return setValues((prev) => ({ ...prev, value1: key, answer: key }));
        }
        return setValues((prev) => ({
          ...prev,
          value1: value1 + key,
          answer: answer + key,
        }));
      }

      if (operators.some((operand) => operand === answer)) {
        return setValues((prev) => ({ ...prev, answer: key, value2: key }));
      }

      if (key === "." && answer.includes(".")) return true;

      if (key !== "." && answer === "0") {
        return setValues((prev) => ({ ...prev, value2: key, answer: key }));
      }
      return setValues((prev) => ({
        ...prev,
        value2: value2 + key,
        answer: answer + key,
      }));
    }

    if (isFuncs) {
      if (key === "del" && value1 !== "") {
        if (operand && !value2) {
          return setValues((prev) => ({
            ...prev,
            answer: value1,
            operand: "",
          }));
        }

        if (value2) {
          if (value2.length === 1) {
            return setValues((prev) => ({
              ...prev,
              value2: "",
              answer: operand,
            }));
          }

          return setValues((prev) => ({
            ...prev,
            value2: value2.slice(0, value2.length - 1),
            answer: value2.slice(0, value2.length - 1),
          }));
        }

        if (value1.length === 1) {
          return setValues((prev) => ({ ...prev, value1: "0", answer: "0" }));
        }

        setValues((prev) => ({
          ...prev,
          value1: value1.slice(0, value1.length - 1),
          answer: value1.slice(0, value1.length - 1),
        }));
      }

      if (key === "=") {
        if (!operand || !value2) return;
        let a = eval(value1 + operand + value2);
        setValues(() => ({
          value1: a.toString(),
          operand: "",
          value2: "",
          answer: a.toString(),
        }));
      }

      if (key === "reset") {
        setValues({
          answer: "0",
          value1: "",
          value2: "",
          operand: "",
        });
      }
    }

    if (isOperator) {
      if (value2) {
        let a = eval(value1 + operand + value2);
        return setValues(() => ({
          value1: a.toString(),
          operand: "",
          value2: "",
          answer: a.toString(),
        }));
      }
      setValues((prev) => ({ ...prev, answer: key, operand: key }));
    }
  }

  function handleCopy() {
    Clipboard.setString(values.answer);
    ToastAndroid.show("Copied!", ToastAndroid.SHORT);
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headText}>Simple Calculator App</Text>
        <TouchableOpacity onPress={handleCopy}>
          <View style={styles.displayContainer}>
            <Text style={styles.displayText}>{values.answer}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.btnContainer}>
          {buttons.map((btn, i) => (
            <TouchableOpacity key={i} onPress={() => handlePress(btn)}>
              <View
                style={
                  btn === "del"
                    ? [styles.btn, { backgroundColor: COLORS.keyBg1 }]
                    : styles.btn
                }
              >
                <Text
                  style={
                    btn === "del"
                      ? [styles.btnText, { color: "#fff" }]
                      : styles.btnText
                  }
                >
                  {btn === "*" ? "×" : btn === "/" ? "÷" : btn}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => handlePress("reset")}>
            <View
              style={[
                styles.btn,
                {
                  backgroundColor: COLORS.keyBg1,
                  width: (SIZES.width - 80) / 2,
                  color: "#fff",
                },
              ]}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>reset</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress("=")}>
            <View
              style={[
                styles.btn,
                {
                  backgroundColor: COLORS.keyBg2,
                  width: (SIZES.width - 80) / 2,
                },
              ]}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>=</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg1,
    alignItems: "center",
    justifyContent: "center",
  },
  headText: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  displayContainer: {
    backgroundColor: COLORS.bg2,
    width: SIZES.width - 40,
    height: 100,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  displayText: {
    color: "#fff",
    fontSize: 40,
    textAlign: "right",
    width: SIZES.width - 80,
    fontFamily: "bold",
  },
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: SIZES.width - 40,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: COLORS.bg3,
    borderRadius: 5,
    paddingVertical: 2,
  },
  btn: {
    width: 72,
    height: 72,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btn2: {
    width: (SIZES.width - 80) / 2,
  },
  btnText: {
    fontSize: 30,
    fontFamily: "semi-bold",
    textAlign: "center",
    color: COLORS.text1,
    textTransform: "uppercase",
  },
});
