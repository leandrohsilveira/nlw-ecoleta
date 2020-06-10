import React, { FC, useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image, Linking } from "react-native";
import { useRoute } from "@react-navigation/native";
import BackButton from "./BackButton";
import IconTextButton from "./IconTextButton";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useApiCallback,
  pointService,
  PointDetailModel,
  itemService,
} from "ecoleta-core";
import { Result } from "ecoleta-core/dist/domain/model";
import * as MailComposer from "expo-mail-composer";

interface PointDetailRouteParams {
  point_id: number;
}

const PointDetail: FC = () => {
  const route = useRoute();
  const { point_id } = route.params as PointDetailRouteParams;
  const [point, setPoint] = useState<Result<PointDetailModel>>();

  const [
    fetchPointDetail,
    loadingPointDetail,
    cancelPointDetailFetch,
  ] = useApiCallback(pointService.findById, setPoint);

  useEffect(() => {
    fetchPointDetail(point_id);
    return () => cancelPointDetailFetch();
  }, [point_id]);

  function handleEmailButtonClick() {
    if (point) {
      MailComposer.composeAsync({
        subject: "Interesse na coleta de resíduos",
        recipients: [point.item.email],
      });
    }
  }

  function handleWhatsAppButtonClick() {
    if (point) {
      Linking.openURL(
        `whatsapp://send?phone=+55${point.item.whatsapp}&text=Tenho interesse em coleta de resíduos`
      );
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <BackButton />

        {point && (
          <>
            <Image
              style={styles.pointImage}
              source={{
                uri:
                  "https://fastly.4sqi.net/img/general/600x600/0VQDHKYUTw4a4fO3VJursPyuBhvTqx3dfq679ytD5ss.jpg",
              }}
            />

            <Text style={styles.pointName}>{point.item.name}</Text>
            <Text style={styles.pointItems}>
              {point.item.items.map((item) => item.title).join(", ")}
            </Text>

            <View style={styles.address}>
              <Text style={styles.addressTitle}>Endereço</Text>
              <Text style={styles.addressContent}>
                {point.item.city}, {point.item.uf}
              </Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.footer}>
        <IconTextButton
          enabled={!loadingPointDetail}
          style={styles.button}
          iconContainerStyle={styles.buttonIcon}
          textStyle={styles.buttonText}
          icon={<FontAwesome name="whatsapp" size={20} color="#fff" />}
          text="WhatsApp"
          onPress={handleWhatsAppButtonClick}
        />
        <IconTextButton
          enabled={!loadingPointDetail}
          style={styles.button}
          iconContainerStyle={styles.buttonIcon}
          textStyle={styles.buttonText}
          icon="mail"
          text="E-mail"
          onPress={handleEmailButtonClick}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: "#322153",
    fontSize: 28,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  pointItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: "#322153",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#999",
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "48%",
    backgroundColor: "#34CB79",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },

  buttonIcon: {},
});

export default PointDetail;
