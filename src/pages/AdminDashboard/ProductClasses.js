class Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    gender,
    discount = 0,
    colors = []
  ) {
    this.name = name;
    this.description = desc;
    this.price = price;
    this.category = category;
    this.brand = brand;
    this.tags = tags;
    this.colors = colors;
    this.gender = gender;
    this.discount = discount;
  }

  setName(name) {
    this.name = name;
  }

  setDesc(desc) {
    this.desc = desc;
  }

  setPrice(price) {
    this.price = price;
  }

  setCategory(cat) {
    this.category = cat;
  }

  setBrand(brand) {
    this.brand = brand;
  }

  setColors(colors) {
    this.colors = colors;
  }

  setTags(tags) {
    this.tags = tags;
  }

  setGender(gender) {
    this.gender = gender;
  }

  setDiscount(discount) {
    this.discount = discount;
  }
}

class Shirt extends Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    colors,
    gender,
    discount
  ) {
    super(name, desc, price, category, brand, tags, colors, gender, discount);
  }
}

class TShirt extends Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    colors,
    gender,
    discount
  ) {
    super(name, desc, price, category, brand, tags, colors, gender, discount);
  }
}

class Pants extends Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    colors,
    gender,
    discount
  ) {
    super(name, desc, price, category, brand, tags, colors, gender, discount);
  }
}

class Shoes extends Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    colors,
    gender,
    discount
  ) {
    super(name, desc, price, category, brand, tags, colors, gender, discount);
  }
}

class Hoodie extends Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    colors,
    gender,
    discount
  ) {
    super(name, desc, price, category, brand, tags, colors, gender, discount);
  }
}

class Jacket extends Product {
  constructor(
    name,
    desc,
    price,
    category,
    brand,
    tags,
    colors,
    gender,
    discount
  ) {
    super(name, desc, price, category, brand, tags, colors, gender, discount);
  }
}

export { Shirt, TShirt, Pants, Shoes, Hoodie, Jacket };
