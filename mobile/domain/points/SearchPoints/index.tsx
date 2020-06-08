import React, { FC } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import BackButton from "../../../components/BackButton";

const SearchPoints: FC = () => {
  const navigation = useNavigation();

  function handleBackButtonPressed() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <>
      <View style={styles.container}>
        <BackButton />

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -26.2779994,
              longitude: -48.8095674,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            <Marker
              style={styles.mapMarker}
              coordinate={{
                latitude: -26.2779994,
                longitude: -48.8095674,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri:
                      "https://fastly.4sqi.net/img/general/600x600/0VQDHKYUTw4a4fO3VJursPyuBhvTqx3dfq679ytD5ss.jpg",
                  }}
                />
                <Text style={styles.mapMarkerTitle}>Supermercado Taíse</Text>
              </View>
            </Marker>
          </MapView>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 25 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <TouchableOpacity key={v} style={styles.item} onPress={() => {}}>
              <SvgUri
                width={42}
                height={42}
                uri="http://192.168.0.12:3333/uploads/lampadas.svg"
              />
              <Text style={styles.itemTitle}>Lâmpadas</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
  },

  mapMarkerContainer: {
    width: 90,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    marginHorizontal: 5,
    textAlign: "center",
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});

export default SearchPoints;
