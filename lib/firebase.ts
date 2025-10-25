// Client-side Firebase configuration
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { doc, getFirestore, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBTRzIOu6yN0Fiq6HGgtam6xc9MIsGKiE4",
  authDomain: "tree-sa.firebaseapp.com",
  databaseURL: "https://tree-sa-default-rtdb.firebaseio.com",
  projectId: "tree-sa",
  storageBucket: "tree-sa.firebasestorage.app",
  messagingSenderId: "1028453914907",
  appId: "1:1028453914907:web:31fd99fe3dcdb3b6fc5bbe",
  measurementId: "G-9QR56T5899"
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
