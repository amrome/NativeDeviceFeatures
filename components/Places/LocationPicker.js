import { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, Linking } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import {
  getCurrentPositionAsync,
  hasServicesEnabledAsync,
  useForegroundPermissions,
  PermissionStatus,
  LocationAccuracy,
} from "expo-location";

import MapView, { Marker } from "react-native-maps";

import { Colors } from "../../constants/colors";
import OutlineButton from "../UI/OutlineButton";
import { getAddress } from "../../util/location";

function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState();
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const route = useRoute();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  useEffect(() => {
    const pickedLat = route.params?.pickedLat;
    const pickedLng = route.params?.pickedLng;

    if (isFocused && pickedLat != null && pickedLng != null) {
      setPickedLocation({ lat: pickedLat, lng: pickedLng });
    }
  }, [isFocused, route.params?.pickedLat, route.params?.pickedLng]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        console.log(
          "[LocationPicker] handleLocation - pickedLocation:",
          pickedLocation
        );
        try {
          const address = await getAddress(
            pickedLocation.lat,
            pickedLocation.lng
          );
          console.log("[LocationPicker] Address fetched:", address);
          onPickLocation({ ...pickedLocation, address: address });
        } catch (error) {
          console.log("[LocationPicker] Address fetch error:", error);
          onPickLocation({
            ...pickedLocation,
            address: "Address not available",
          });
          console.log(error);
        }
      }
    }

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
    if (
      !locationPermissionInformation ||
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
      return false;
    }
    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const servicesEnabled = await hasServicesEnabledAsync();
    if (!servicesEnabled) {
      Alert.alert(
        "Location services disabled",
        "Please enable location services (GPS) on your device to get your current location."
      );
      return;
    }

    try {
      const location = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.Balanced,
      });

      if (!location?.coords) {
        throw new Error("No coordinates returned");
      }

      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert(
        "Could not fetch location",
        "Please try again or pick a location on the map."
      );
      console.log(error);
    }
  }

  function pickOnMapHandler() {
    navigation.navigate("Map", {
      returnTo: route.key,
    });
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    locationPreview = (
      <MapView
        style={styles.map}
        pointerEvents="none"
        region={{
          latitude: pickedLocation.lat,
          longitude: pickedLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: pickedLocation.lat,
            longitude: pickedLocation.lng,
          }}
        />
      </MapView>
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlineButton icon="location" onPress={getLocationHandler}>
          Get User Location
        </OutlineButton>
        <OutlineButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlineButton>
      </View>
    </View>
  );
}
export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  image: { width: "100%", height: "100%" },
  map: { width: "100%", height: "100%" },
});
