// Client-side Firebase configuration
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { doc, getFirestore, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const database = getDatabase(app)

export async function addData(data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("visitor", data.id)
  }

  try {
    const docRef = doc(db, "pays", data.id!)
    await setDoc(
      docRef,
      {
        ...data,
        createdDate: new Date().toISOString(),
      },
      { merge: true },
    )

    console.log("Document written with ID: ", docRef.id)
    return { success: true, id: docRef.id }
  } catch (e) {
    console.error("Error adding document: ", e)
    throw new Error("Failed to add document")
  }
}

export async function handlePay(paymentInfo: any, setPaymentInfo: any) {
  try {
    const visitorId = typeof window !== "undefined" ? localStorage.getItem("visitor") : null

    if (visitorId) {
      const docRef = doc(db, "pays", visitorId)
      await setDoc(docRef, { ...paymentInfo, status: "pending" }, { merge: true })
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }))
      return { success: true }
    } else {
      throw new Error("No visitor ID found")
    }
  } catch (error) {
    console.error("Error adding document: ", error)
    throw new Error("Error adding payment info to Firestore")
  }
}

export { db, database }
