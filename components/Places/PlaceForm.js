import { useCallback, useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { Alert } from "react-native";

import { Colors } from "../../constants/colors";
import { Place } from "../../models/place";
import Button from "../UI/Button";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState();

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    console.log("[PlaceForm] pickLocationHandler called with:", location);
    setSelectedLocation(location);
  }, []);

  function savePlaceHandler() {
    console.log("[PlaceForm] savePlaceHandler - Title:", enteredTitle);
    console.log("[PlaceForm] savePlaceHandler - Image:", selectedImage);
    console.log("[PlaceForm] savePlaceHandler - Location:", selectedLocation);

    if (!enteredTitle || enteredTitle.trim().length === 0) {
      Alert.alert("Missing title", "Please enter a title.");
      return;
    }

    if (!selectedImage) {
      Alert.alert("Missing image", "Please take an image.");
      return;
    }

    if (!selectedLocation || !selectedLocation.lat || !selectedLocation.lng) {
      Alert.alert("Missing location", "Please pick a location.");
      return;
    }

    const placeData = new Place(enteredTitle, selectedImage, selectedLocation);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: { fontWeight: "bold", marginBottom: 4, color: Colors.primary500 },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
