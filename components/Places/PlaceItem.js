import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/colors";

function PlaceItem({ place, onSelect, onDelete }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={onSelect.bind(this, place.id)}
      onLongPress={onDelete.bind(this, place)}
    >
      <Image source={{ uri: place.imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address}>{place.address}</Text>
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={onDelete.bind(this, place)}
      >
        <Ionicons name="trash-outline" size={24} color={Colors.gray700} />
      </Pressable>
    </Pressable>
  );
}
export default PlaceItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 6,
    marginVertical: 12,
    marginHorizontal: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    flex: 1,
    height: 100,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.gray700,
  },
  address: {
    fontSize: 12,
    color: Colors.gray700,
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
  },
});
