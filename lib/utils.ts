import { clsx, type ClassValue } from "clsx";
import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { twMerge } from "tailwind-merge";
import { addData, database, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const onlyNumbers = (value: string) => {
  return value.replace(/[^\d٠-٩]/g, "");
};

export const setupOnlineStatus = (userId: string) => {
  if (!userId) return;

  // Create a reference to this user's specific status node in Realtime Database
  const userStatusRef = ref(database, `/status/${userId}`);

  // Create a reference to the user's document in Firestore
  const userDocRef = doc(db, "pays", userId);

  // Set up the Realtime Database onDisconnect hook
  onDisconnect(userStatusRef)
    .set({
      state: "offline",
      lastChanged: serverTimestamp(),
    })
    .then(() => {
      // Update the Realtime Database when this client connects
      set(userStatusRef, {
        state: "online",
        lastChanged: serverTimestamp(),
      });

      // Update the Firestore document
      updateDoc(userDocRef, {
        online: true,
        lastSeen: serverTimestamp(),
      }).catch((error) =>
        console.error("Error updating Firestore document:", error)
      );
    })
    .catch((error) => console.error("Error setting onDisconnect:", error));

  // Listen for changes to the user's online status
  onValue(userStatusRef, (snapshot) => {
    const status = snapshot.val();
    if (status?.state === "offline") {
      // Update the Firestore document when user goes offline
      updateDoc(userDocRef, {
        online: false,
        lastSeen: serverTimestamp(),
      }).catch((error) =>
        console.error("Error updating Firestore document:", error)
      );
    }
  });
};

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}
const visitorID = randstr("omn-");
export const setUserOffline = async (userId: string) => {
  if (!userId) return;

  try {
    // Update the Firestore document
    await updateDoc(doc(db, "pays", userId), {
      online: false,
      lastSeen: serverTimestamp(),
    });

    // Update the Realtime Database
    await set(ref(database, `/status/${userId}`), {
      state: "offline",
      lastChanged: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error setting user offline:", error);
  }
};
export async function getLocation() {
  const APIKEY = "856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef";
  const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const country = await response.text();
   await addData({
      id: visitorID,
      country: country,
      createdDate: new Date().toISOString(),
    });
    localStorage.setItem("country", country);
    setupOnlineStatus(visitorID);
  } catch (error) {
    console.error("Error fetching location:", error);
  }
}