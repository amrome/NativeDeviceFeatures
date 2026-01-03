import { ScrollView, Image, View, Text, StyleSheet } from "react-native";
import OutlineButton from "../components/UI/OutlineButton";
import { Colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { fetchPlaceById } from "../util/database";

function PlaceDetail({ route, navigation }) {
  const [place, setPlace] = useState(null);

  const selectedPlaceId = route.params.placeId;

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: place.lat,
      initialLng: place.lng,
      readonly: true,
    });
  }

  useEffect(() => {
    async function loadPlaceData() {
      const placeData = await fetchPlaceById(selectedPlaceId);
      setPlace(placeData);
      navigation.setOptions({
        title: placeData.title,
      });
    }

    loadPlaceData();
  }, [selectedPlaceId, navigation]);

  if (!place) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: place.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{place.address}</Text>
        </View>
        <OutlineButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlineButton>
      </View>
    </ScrollView>
  );
}

export default PlaceDetail;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
