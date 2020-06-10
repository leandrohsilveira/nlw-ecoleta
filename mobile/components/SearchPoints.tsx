import React, { FC, useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import { Routes } from "./Router/routes";
import BackButton from "./BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useApiCallback,
  Item,
  itemService,
  pointService,
  PointModel,
  geolocationService,
  GeolocationModel,
} from "ecoleta-core";
import { ResultList } from "ecoleta-core/dist/domain/model";
import { useRouteParams } from "../util/route-util";

interface SearchPointsRouteParams {
  uf: string;
  city: string;
}

function SearchPoints() {
  const params = useRouteParams<SearchPointsRouteParams>();
  const navigation = useNavigation();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [pointsResult, setPointsResult] = useState<ResultList<PointModel>>();
  const [geolocation, setGeolocation] = useState<GeolocationModel>();
  const [uf] = useState(params.uf);
  const [city] = useState(params.city);

  const points = useMemo(() => pointsResult?.items ?? [], [pointsResult]);

  const [fetchItems, , cancelFetchItems] = useApiCallback(
    itemService.findAll,
    setItems
  );

  const [fetchPoints, , cancelFetchPoints] = useApiCallback(
    pointService.findAllByUfAndCityAndItensIn,
    setPointsResult
  );

  const [fetchGeolocationOfUfAndCity, , cancelGeolocation] = useApiCallback(
    geolocationService.getByUfAndCity,
    setGeolocation
  );

  useEffect(() => {
    fetchItems();
    return () => cancelFetchItems();
  }, []);

  useEffect(() => {
    console.log("Fetching points", uf, city, selectedItems);
    fetchPoints(uf, city, selectedItems);
    return () => cancelFetchPoints();
  }, [uf, city, selectedItems]);

  useEffect(() => {
    fetchGeolocationOfUfAndCity(uf, city);
    return () => cancelGeolocation();
  }, [uf, city]);

  function handleMapMarkerPressed(point_id: number) {
    navigation.navigate(Routes.POINT_DETAIL, { point_id });
  }

  function handleItemPressed(id: number) {
    setSelectedItems((selectedItems) => {
      if (selectedItems.includes(id))
        return selectedItems.filter((item) => item !== id);
      else return [...selectedItems, id];
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton />

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>
        <Text style={styles.description}>
          Visualizando pontos de coleta para a cidade {city}, {uf}:
        </Text>

        <View style={styles.mapContainer}>
          {geolocation && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: geolocation.lat,
                longitude: geolocation.lng,
                latitudeDelta: 0.35,
                longitudeDelta: 0.35,
              }}
            >
              {points.map(({ id, latitude, longitude, name }) => (
                <Marker
                  key={String(id)}
                  style={styles.mapMarker}
                  onPress={() => handleMapMarkerPressed(id)}
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
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
                    <Text style={styles.mapMarkerTitle}>{name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 25 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {items.map(({ id, image_url, title }) => (
            <TouchableOpacity
              key={String(id)}
              style={[
                styles.item,
                selectedItems.includes(id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleItemPressed(id)}
            >
              <SvgUri
                width={42}
                height={42}
                uri={image_url}
                accessibilityLabel={title}
              />
              <Text style={styles.itemTitle}>{title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
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
