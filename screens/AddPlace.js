import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";
import { Alert } from "react-native";

function AddPlace({ navigation }) {
  async function createPlaceHandler(place) {
    try {
      await insertPlace(place);
      navigation.navigate("AllPlaces");
    } catch (error) {
      Alert.alert(
        "Could not save place",
        "Please make sure you've picked an image and a location, then try again."
      );
      console.log(error);
    }
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
