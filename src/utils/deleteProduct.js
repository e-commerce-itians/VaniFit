import { doc, deleteDoc } from "firebase/firestore";

export async function deleteProduct(prodId) {
  try {
    await deleteDoc(doc(App.firebase.db, "products", prodId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}
