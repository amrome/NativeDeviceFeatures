import { StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useCallback, useLayoutEffect, useState } from "react";
import { CommonActions } from "@react-navigation/native";

import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  const isReadonly = route.params?.readonly || false;

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: isReadonly ? 0.005 : 0.0922,
    longitudeDelta: isReadonly ? 0.005 : 0.0421,
  };

  //   const initialLocation =
  //     route.params?.initialLat && route.params?.initialLng
  //       ? {
  //           latitude: route.params.initialLat,
  //           longitude: route.params.initialLng,
  //           latitudeDelta: 0.0922,
  //           longitudeDelta: 0.0421,
  //         }
  //       : {
  //           latitude: 37.78,
  //           longitude: -122.43,
  //           latitudeDelta: 0.0922,
  //           longitudeDelta: 0.0421,
  //         };

  function selectLocationHandler(event) {
    if (isReadonly) {
      return;
    }

    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        "No location picked!",
        "You have to pick a location (by tapping on the map) first!"
      );
      return;
    }

    const returnTo = route?.params?.returnTo;

    if (returnTo) {
      navigation.dispatch({
        ...CommonActions.setParams({
          pickedLat: selectedLocation.lat,
          pickedLng: selectedLocation.lng,
        }),
        source: returnTo,
      });
    }

    navigation.goBack();
  }, [selectedLocation, navigation, route]);

  useLayoutEffect(() => {
    if (isReadonly) {
      return;
    }

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, isReadonly]);

  return (
    <MapView
      style={styles.map}
      initialRegion={initialLocation}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
