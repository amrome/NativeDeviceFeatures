import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseSync("places.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database
      .execAsync(
        `CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL
            )`
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

export function insertPlace(place) {
  const promise = new Promise((resolve, reject) => {
    database
      .runAsync(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
        place.title,
        place.imageUri,
        place.address,
        place.location.lat,
        place.location.lng
      )
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
  return promise;
}

export function fetchPlaces() {
  const promise = new Promise((resolve, reject) => {
    database
      .getAllAsync(`SELECT * FROM places`)
      .then((rows) => {
        console.log("[fetchPlaces] rows:", rows);
        resolve(rows);
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise;
}
