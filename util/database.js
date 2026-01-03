import * as SQLite from "expo-sqlite";

import { Place } from "../models/place";

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
        const places = [];

        for (const dp of result.rows._array) {
          places.push(
            new Place(
              dp.title,
              dp.imageUri,
              {
                address: dp.address,
                lat: dp.lat,
                lng: dp.lng,
              },
              dp.id
            )
          );
        }

        resolve(places);
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

export function fetchPlaceById(id) {
  const promise = new Promise((resolve, reject) => {
    database
      .getAllAsync(`SELECT * FROM places WHERE id = ?`, [id])
      .then((rows) => {
        if (rows.length > 0) {
          resolve(rows[0]);
        } else {
          reject(new Error("Place not found"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise;
}

export function deleteAllPlaces() {
  const promise = new Promise((resolve, reject) => {
    database
      .runAsync(`DELETE FROM places`)
      .then(() => {
        console.log("All places deleted");
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

export function deletePlace(id) {
  const promise = new Promise((resolve, reject) => {
    database
      .runAsync(`DELETE FROM places WHERE id = ?`, [id])
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}
