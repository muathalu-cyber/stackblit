// Client-side Firebase configuration
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { doc, getFirestore, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCGXGWc8wON-OL0mEi2vX_B5K7PytlHjfw",
  authDomain: "ah-moror.firebaseapp.com",
  projectId: "ah-moror",
  storageBucket: "ah-moror.firebasestorage.app",
  messagingSenderId: "869838548515",
  appId: "1:869838548515:web:9d1bb5c87d96d2f2d74b96",
  measurementId: "G-4VGVLNQK1L"
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
