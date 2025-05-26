import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { observer } from "../../observer";
import "./Home.css";
const componentID = "home";

export default async function Home() {
  observer(componentID, compLoaded);
  return /*html*/ `
  <div component="${componentID}" class="mt-0 mb-5">
    <div id="hero">
    <section class="container pt-2">
      <div class="row align-items-center">
        <!-- Text Section -->
        <div class="col-md-6 text-center text-md-start mt-5 mt-lg-0">
          <h1 id="logo-font" class="fw-bold">Find Clothes<br>That Matches Your Style</h1>
          <p class="text-muted">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <a href="/shop" class="shop-now-btn" data-link>Shop Now</a>

          <!-- Stats -->
          <div class="row mt-4">
            <div class="col-4">
              <h3 class="mb-0">200+</h3>
              <small class="text-muted">Brands</small>
            </div>
            <div class="col-4">
              <h3 class="mb-0">2,000+</h3>
              <small class="text-muted">Products</small>
            </div>
            <div class="col-4">
              <h3 class="mb-0">30,000+</h3>
              <small class="text-muted">Customers</small>
            </div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="col-md-6 mt-4 mt-md-0">
           <img src="images/hero.jpg" class="img-fluid" alt="Models" width="2730" height="4096">
        </div>
      
      </div>
      </div>
    </section>
    <!-- Brand Logos -->
    <div class="container-fluid bg-black py-4">
      <div class="d-flex flex-wrap justify-content-center align-items-center gap-5">
        <a href="/shop?brand=versace" class="text-white fs-3 fw-light text-decoration-none" data-link>VERSACE</a>
        <a href="/shop?brand=zara" class="text-white fs-3 fw-light text-decoration-none" data-link>ZARA</a>
        <a href="/shop?brand=gucci" class="text-white fs-3 fw-light text-decoration-none" data-link>GUCCI</a>
        <a href="/shop?brand=prada" class="text-white fs-3 fw-bold text-decoration-none" data-link>PRADA</a>
        <a href="/shop?brand=calvin klein" class="text-white fs-3 fw-light text-decoration-none" data-link>Calvin Klein</a>
      </div>
    </div>
      <div class="container py-5">
        <!-- Men's Section -->
        <div>
          <h2 class="section-title">MEN'S COLLECTION</h2>
          <div id="mens-products" class="row g-4 justify-content-center">
            <!-- Placeholder cards that will be replaced with actual products -->
            ${Array(5)
              .fill(
                `
              <div class="col-6 col-md-4 col-lg-2">
                <div class="product-card">
                  <div class="product-img placeholder-glow"></div>
                  <p class="placeholder-glow"><span class="placeholder col-6"></span></p> 
                  <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
                  <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="text-center mt-4">
            <a href="/shop/male" class="btn btn-outline-dark" data-link>View All Men's</a>
          </div>
        </div>

        <hr class="my-5" />

        <!-- Women's Section -->
        <div>
          <h2 class="section-title">WOMEN'S COLLECTION</h2>
          <div id="womens-products" class="row g-4 justify-content-center">
            <!-- Placeholder cards that will be replaced with actual products -->
            ${Array(5)
              .fill(
                `
              <div class="col-6 col-md-4 col-lg-2">
                <div class="product-card">
                  <div class="product-img placeholder-glow"></div>
                  <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
                  <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
                  <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="text-center mt-4">
            <a href="/shop/female" class="btn btn-outline-dark" data-link>View All Women's</a>
          </div>
        </div>

        <hr class="my-5" />

        <!-- Children's Section -->
        <div>
          <h2 class="section-title">CHILDREN'S COLLECTION</h2>
          <div id="childrens-products" class="row g-4 justify-content-center">
            <!-- Placeholder cards that will be replaced with actual products -->
            ${Array(5)
              .fill(
                `
              <div class="col-6 col-md-4 col-lg-2">
                <div class="product-card">
                  <div class="product-img placeholder-glow"></div>
                  <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
                  <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
                  <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="text-center mt-4">
            <a href="/shop/children" class="btn btn-outline-dark" data-link>View All Children's</a>
          </div>
        </div>
      </div>
        <div class="container rounded-5" id="style-container">
        <h2 class="section-title py-3">BROWSE BY dress STYLE</h2>
        <div class="d-flex flex-wrap justify-content-center align-items-center gap-4 pb-4" >
        <a href="/shop?style=casual" data-link><img class="img-fluid" src="images/casual.png" alt="Casual Style"></a>
        <a href="/shop?style=formal" data-link><img class="img-fluid" src="images/formal.png" alt="Formal Style"></a>
        <a href="/shop?style=party" data-link><img class="img-fluid" src="images/party.png" alt="Party Style"></a>
        <a href="/shop?style=gym" data-link><img class="img-fluid" src="images/gym.png" alt="Gym Style"></a>
        </div>
    </div>
  </div>
  `;
}

const compLoaded = async () => {
  try {
    // Fetch men's products
    const mensQuery = query(
      collection(App.firebase.db, "products"),
      where("gender", "==", "male"),
      limit(5)
    );
    const mensSnapshot = await getDocs(mensQuery);
    const mensProducts = [];
    mensSnapshot.forEach((doc) => {
      mensProducts.push({ id: doc.id, ...doc.data() });
    });

    // Fetch women's products
    const womensQuery = query(
      collection(App.firebase.db, "products"),
      where("gender", "==", "female"),
      limit(5)
    );
    const womensSnapshot = await getDocs(womensQuery);
    const womensProducts = [];
    womensSnapshot.forEach((doc) => {
      womensProducts.push({ id: doc.id, ...doc.data() });
    });

    // Fetch children's products
    const childrensQuery = query(
      collection(App.firebase.db, "products"),
      where("gender", "==", "children"),
      limit(5)
    );
    const childrensSnapshot = await getDocs(childrensQuery);
    const childrensProducts = [];
    childrensSnapshot.forEach((doc) => {
      childrensProducts.push({ id: doc.id, ...doc.data() });
    });

    // Update men's section
    const mensContainer = document.getElementById("mens-products");
    if (mensProducts.length > 0) {
      mensContainer.innerHTML = mensProducts
        .map(
          (product) => `
          <div class="col-6 col-md-4 col-lg-2">
            <a href="/product/${product.id}" class="text-decoration-none" data-link>
              <div class="product-card">
                <img src="${product.colors[0].image_urls[0]}" class="product-img" alt="${product.name}">
                <h5 class="product-title">${product.name}</h5>
                <p class="product-brand text-muted">${product.brand}</p>
                <p class="product-price">$${product.price}</p>
              </div>
            </a>
          </div>
        `
        )
        .join("");
    }

    // Update women's section
    const womensContainer = document.getElementById("womens-products");
    if (womensProducts.length > 0) {
      womensContainer.innerHTML = womensProducts
        .map(
          (product) => `
          <div class="col-6 col-md-4 col-lg-2">
            <a href="/product/${product.id}" class="text-decoration-none" data-link>
              <div class="product-card">
                <img src="${product.colors[0].image_urls[0]}" class="product-img" alt="${product.name}">
                <h5 class="product-title">${product.name}</h5>
                <p class="product-brand text-muted">${product.brand}</p>
                <p class="product-price">$${product.price}</p>
              </div>
            </a>
          </div>
        `
        )
        .join("");
    }

    // Update children's section
    const childrensContainer = document.getElementById("childrens-products");
    if (childrensProducts.length > 0) {
      childrensContainer.innerHTML = childrensProducts
        .map(
          (product) => `
          <div class="col-6 col-md-4 col-lg-2">
            <a href="/product/${product.id}" class="text-decoration-none" data-link>
              <div class="product-card">
                <img src="${product.colors[0].image_urls[0]}" class="product-img" alt="${product.name}">
                <h5 class="product-title">${product.name}</h5>
                <p class="product-brand text-muted">${product.brand}</p>
                <p class="product-price">$${product.price}</p>
              </div>
            </a>
          </div>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
