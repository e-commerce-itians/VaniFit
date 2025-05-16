class Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    this.name = name;
    this.description = desc;
    this.price = price;
    this.category = category;
    this.brand = brand;
    this.tags = tags;
    this.colors = colors;
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
}

class Shirt extends Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    super(name, desc, price, category, brand, tags, colors);
  }
}

class TShirt extends Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    super(name, desc, price, category, brand, tags, colors);
  }
}

class Pants extends Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    super(name, desc, price, category, brand, tags, colors);
  }
}

class Shoes extends Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    super(name, desc, price, category, brand, tags, colors);
  }
}

class Hoodie extends Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    super(name, desc, price, category, brand, tags, colors);
  }
}

class Jacket extends Product {
  constructor(name, desc, price, category, brand, tags, colors) {
    super(name, desc, price, category, brand, tags, colors);
  }
}

export { Shirt, TShirt, Pants, Shoes, Hoodie, Jacket };
