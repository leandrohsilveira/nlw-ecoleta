import React, { FC, useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  TouchableOpacity,
  ScrollView,
  RectButton,
} from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker, Region } from "react-native-maps";
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
  useDidMountEffect,
} from "ecoleta-core";
import { ResultList } from "ecoleta-core/dist/domain/model";
import { useRouteParams } from "../util/route-util";
import IconTextButton from "./IconTextButton";

interface SearchPointsRouteParams {
  uf: string;
  city: string;
}

async function _fetchGeolocationByRegion(
  region: Region,
  orElse?: GeolocationModel
) {
  const { latitude, longitude } = region;
  const location = await geolocationService.getByLatAndLng(latitude, longitude);
  return !!location.city ? location : orElse;
}

function SearchPoints() {
  const params = useRouteParams<SearchPointsRouteParams>();
  const navigation = useNavigation();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [pointsResult, setPointsResult] = useState<ResultList<PointModel>>();
  const [geolocation, setGeolocation] = useState<GeolocationModel>();
  const [region, setRegion] = useState<Region>();
  const [locationChanged, setLocationChanged] = useState(false);

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

  const [
    fetchGeolocationByRegion,
    ,
    cancelGeolocationByRegion,
  ] = useApiCallback(_fetchGeolocationByRegion, setGeolocation);

  useEffect(() => {
    fetchItems();
    return () => cancelFetchItems();
  }, []);

  useEffect(() => {
    const city = geolocation?.city ?? params.city;
    const uf = geolocation?.state_code ?? params.uf;
    console.log("Fetching points", uf, city, selectedItems);
    fetchPoints(uf, city, selectedItems);
    setLocationChanged(false);
    return () => cancelFetchPoints();
  }, [geolocation, selectedItems]);

  useDidMountEffect(() => {
    fetchGeolocationOfUfAndCity(params.uf, params.city);
    return () => {
      cancelGeolocation();
      cancelGeolocationByRegion();
    };
  });

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

  function handleRegionChangeComplete(region: Region) {
    if (geolocation) {
      setRegion(region);
      const latDelta = Math.abs(region.latitude - geolocation.lat);
      const lngDelta = Math.abs(region.longitude - geolocation.lng);
      if (
        latDelta >= geolocation.latDelta / 2 ||
        lngDelta >= geolocation.lngDelta / 2
      ) {
        setLocationChanged(true);
      } else {
        setLocationChanged(false);
      }
    }
  }

  function handleFetchPointsOfRegion() {
    if (region) {
      fetchGeolocationByRegion(region, geolocation);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton />

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>
        {geolocation && (
          <>
            <Text style={styles.description}>
              Visualizando pontos de coleta para a cidade {geolocation.city},{" "}
              {geolocation.state_code}:
            </Text>

            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: geolocation.lat,
                  longitude: geolocation.lng,
                  latitudeDelta: geolocation.latDelta,
                  longitudeDelta: geolocation.lngDelta,
                }}
                onRegionChangeComplete={handleRegionChangeComplete}
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
              {locationChanged && (
                <View
                  style={{
                    position: "absolute", //use absolute position to show button on top of the map
                    top: "80%", //for center align
                    alignSelf: "center", //for align to right
                  }}
                >
                  <IconTextButton
                    style={styles.mapButton}
                    textStyle={styles.mapButtonText}
                    text="Carregar pontos de coleta desta região"
                    onPress={handleFetchPointsOfRegion}
                  />
                </View>
              )}
            </View>
          </>
        )}
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

  mapButton: {
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34CB79",
    height: 30,
    marginBottom: 10,
    alignSelf: "flex-end",
  },

  mapButtonText: {
    color: "#fff",
    fontSize: 12,
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
