class Product {
  constructor(name, desc, price, category, brand, tags, gender, colors = []) {
    this.name = name;
    this.description = desc;
    this.price = price;
    this.category = category;
    this.brand = brand;
    this.tags = tags;
    this.colors = colors;
    this.gender = gender;
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
}

class Shirt extends Product {
  constructor(name, desc, price, category, brand, tags, colors, gender) {
    super(name, desc, price, category, brand, tags, colors, gender);
  }
}

class TShirt extends Product {
  constructor(name, desc, price, category, brand, tags, colors, gender) {
    super(name, desc, price, category, brand, tags, colors, gender);
  }
}

class Pants extends Product {
  constructor(name, desc, price, category, brand, tags, colors, gender) {
    super(name, desc, price, category, brand, tags, colors, gender);
  }
}

class Shoes extends Product {
  constructor(name, desc, price, category, brand, tags, colors, gender) {
    super(name, desc, price, category, brand, tags, colors, gender);
  }
}

class Hoodie extends Product {
  constructor(name, desc, price, category, brand, tags, colors, gender) {
    super(name, desc, price, category, brand, tags, colors, gender);
  }
}

class Jacket extends Product {
  constructor(name, desc, price, category, brand, tags, colors, gender) {
    super(name, desc, price, category, brand, tags, colors, gender);
  }
}

export { Shirt, TShirt, Pants, Shoes, Hoodie, Jacket };
