import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces } from "../util/database";
import { Place } from "../models/place";

function AllPlaces({ route }) {
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

  return <PlacesList places={loadedPlaces} />;
}
export default AllPlaces;
