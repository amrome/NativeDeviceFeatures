import { useEffect, useState, useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Alert, View } from "react-native";

import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces, deletePlace, deleteAllPlaces } from "../util/database";
import { Place } from "../models/place";
import IconButton from "../components/UI/IconButton";

function AllPlaces({ route, navigation }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      const mappedPlaces = places.map(
        (place) =>
          new Place(
            place.title,
            place.imageUri,
            { lat: place.lat, lng: place.lng, address: place.address },
            place.id
          )
      );
      setLoadedPlaces(mappedPlaces);
    }

    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => navigation.push("AddPlace")}
          />
          <IconButton
            icon="trash"
            size={24}
            color={tintColor}
            onPress={handleDeleteAll}
          />
        </View>
      ),
    });
  }, [navigation]);

  async function handleDeleteAll() {
    Alert.alert(
      "Delete All Places",
      "Are you sure you want to delete all places? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            await deleteAllPlaces();
            setLoadedPlaces([]);
          },
        },
      ]
    );
  }

  async function handleDeletePlace(id) {
    await deletePlace(id);
    setLoadedPlaces((currentPlaces) =>
      currentPlaces.filter((place) => place.id !== id)
    );
  }

  return <PlacesList places={loadedPlaces} onDeletePlace={handleDeletePlace} />;
}
export default AllPlaces;
