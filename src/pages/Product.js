import Getdata from "../utils/Getdata";

export default async function Product({ id }) {
  const product = await Getdata("products", "d07YRTLeQejlGWkSn9Im");

  return `
     <div class="m-5">
        Brand: ${product.brand}
        <br>
        Category: ${product.category}
        <br>
         description: ${product.description}
     </div>
  `;
}
