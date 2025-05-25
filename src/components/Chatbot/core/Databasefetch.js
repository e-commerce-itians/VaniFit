import { collection, getDocs } from "firebase/firestore";
// Cache management
const CACHE_KEY = "ProductsCache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in ms

async function fetchProductsWithCache() {
  // 1. Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  const now = Date.now();

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);

    // Use cache if not expired
    if (now - timestamp < CACHE_DURATION) {
      console.log("Using cached products");
      return data;
    }
  }

  // 2. Fetch fresh data from Firestore
  console.log("Fetching fresh products from Firestore");
  try {
    const productsCol = collection(App.firebase.db, "products");
    const snapshot = await getDocs(productsCol);
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure all required fields exist
      return {
        id: doc.id,
        gender: data.gender,
        colors: data.colors.map((color) => ({
          hex: color.hex,
          image_urls: color.image_urls || ["", "", ""], // Ensure empty strings
          name: color.name,
          sizes: color.sizes || {}, // Ensure sizes exists
        })),
        brand: data.brand,
        name: data.name,
        category: data.category,
        price: data.price,
        tags: data.tags || [],
        description: data.description,
        discount: data.discount || 0,
      };
    });

    // 3. Update cache
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: products,
        timestamp: now,
      })
    );

    return products;
  } catch (error) {
    console.error("Firestore error:", error);
    // Fallback to cache if available (even if expired)
    return cachedData ? JSON.parse(cachedData).data : [];
  }
}
// Usage in your chatbot:
let productsDatabase;
async function Databasefetch() {
  productsDatabase = await fetchProductsWithCache();
}

function getProductsDatabase() {
  return productsDatabase;
}

export { Databasefetch, getProductsDatabase };
