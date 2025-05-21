import { observer } from "../../observer";
import "./Productcard.css";

export default function Productcard(
  productID,
  productTitle,
  productPrice,
  productDiscount,
  productImage,
  productColors
) {
  const componentID = `productCard_${productID}`;
  observer(componentID, () => {
    compLoaded(
      productID,
      productTitle,
      productPrice,
      productDiscount,
      productImage,
      productColors
    );
  });
  return /*html*/ `
    <div component="${componentID}" class="col-md-3 mb-4">
      <a class="card border-0" href="/product/${productID}" data-link>
        <div class="text-center bg-light rounded-3">
          <img style="height: 300px;width: 100%;object-fit: cover;" class="rounded-2" id="imgContainer_${productID}" />
        </div>
        <div class="card-body">
          <h5 class="card-title fw-bold" id="prodTitle_${productID}"></h5>

          <div
            class="d-flex align-items-center mb-3"
            id="prodColors_${productID}"
          ></div>

          <div class="d-flex align-items-center">
            <h5 class="fw-bold me-2" id="prodPrice_${productID}"></h5>
            <h5
              class="fw-bold text-decoration-line-through text-muted"
              id="prodOldPrice_${productID}"
            ></h5>
            <span
              class="badge bg-danger bg-opacity-10 text-danger ms-2"
              id="prodPrecentage_${productID}"
            ></span>
          </div>
        </div>
      </a>
    </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async (
  productID,
  productTitle,
  productPrice,
  productDiscount,
  productImage,
  productColors
) => {
  const prodImage = document.querySelector(`#imgContainer_${productID}`);
  const prodTitle = document.querySelector(`#prodTitle_${productID}`);
  const prodColors = document.querySelector(`#prodColors_${productID}`);
  const prodPrice = document.querySelector(`#prodPrice_${productID}`);
  const prodOldPrice = document.querySelector(`#prodOldPrice_${productID}`);
  const prodPrecentage = document.querySelector(`#prodPrecentage_${productID}`);

  //product image
  if (prodImage) {
    prodImage.src = productImage;
  }

  if (productTitle) {
    //product title
    prodTitle.innerText = productTitle;
  }

  //productcolors
  if (productColors) {
    prodColors.innerHTML = generateColorButtonsHTML(productColors);
  }

  if (productPrice) {
    //Product Price
    if (productDiscount && productDiscount != 0) {
      prodOldPrice.innerText = `${productPrice}$`;
      productPrice = productPrice - (productPrice * productDiscount) / 100;
      prodPrecentage.innerText = `-${productDiscount}%`;
    }
    prodPrice.innerText = productPrice + "$";
  }

  function generateColorButtonsHTML(colors) {
    return colors
      .map(
        (color) => `
        <button class="btn rounded-5 me-2" style="width:25px; height:25px; background-color:${color.hex}"></button>
    `
      )
      .join("");
  }
};
