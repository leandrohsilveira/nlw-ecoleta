import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../Router/routes";
import IconTextButton from "../IconTextButton";
import SelectInput from "react-native-picker-select";
import {
  useApiCallback,
  ibgeService,
  IbgeUF,
  IbgeMunicipio,
} from "ecoleta-core";

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<IbgeUF[]>([]);
  const [cities, setCities] = useState<IbgeMunicipio[]>([]);
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [fetchUfs, loadingUfs, cancelUfsFetch] = useApiCallback(
    ibgeService.findAllUfs,
    setUfs
  );
  const [fetchCities, loadingCities, cancelCitiesFetch] = useApiCallback(
    ibgeService.findAllMunicipiosByUf,
    setCities
  );

  const ufPlaceholder = useMemo(
    () => (loadingUfs ? "Carregando UFs..." : "Selecione uma UF"),
    [loadingUfs]
  );
  const cityPlaceholder = useMemo(
    () =>
      loadingCities
        ? "Carregando cidades..."
        : uf
        ? "Selecione uma cidade"
        : "Selecione uma UF primeiro",
    [loadingCities, uf]
  );

  useEffect(() => {
    fetchUfs();
    return () => cancelUfsFetch();
  }, []);

  useEffect(() => {
    if (uf) fetchCities(uf);
    return () => cancelCitiesFetch();
  }, [uf]);

  function handleSignInButtonPressed() {
    navigation.navigate(Routes.SEARCH_POINTS, {
      uf: uf,
      city: city,
    });
  }

  function handleUfChange(value: string) {
    setUf(value);
    setCity("");
  }

  function handleCityChange(value: string) {
    setCity(value);
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/home-background.png")}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <View style={styles.footer}>
        <SelectInput
          style={{
            placeholder: styles.inputText,
            viewContainer: styles.inputContainer,
          }}
          value={uf}
          onValueChange={handleUfChange}
          items={ufs.map(({ id, nome, sigla }) => ({
            key: id,
            label: `${nome} (${sigla})`,
            value: sigla,
          }))}
          placeholder={{ key: -1, label: ufPlaceholder, value: "" }}
        />
        <SelectInput
          style={{
            placeholder: styles.inputText,
            viewContainer: styles.inputContainer,
          }}
          value={city}
          onValueChange={handleCityChange}
          placeholder={{ key: -1, label: cityPlaceholder, value: "" }}
          items={cities.map(({ id, nome }) => ({
            key: id,
            label: nome,
            value: nome,
          }))}
        />
        <IconTextButton
          icon="arrow-right"
          text="Entrar"
          onPress={handleSignInButtonPressed}
        />
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  backgroundImage: {
    width: 274,
    height: 368,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  inputText: {
    color: "#bbb",
  },

  inputContainer: {
    marginVertical: 5,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
});
