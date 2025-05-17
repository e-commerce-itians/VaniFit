import { observer } from "../../observer";
import { collection, getDocs } from "firebase/firestore";
const componentID = "ProductList";

export default function ProductList() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
        <h1>Product List Page</h1>
    </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(App.firebase.db, "products")
    );

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched products:", products);
    document.getElementById("ProductList").innerHTML = products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
