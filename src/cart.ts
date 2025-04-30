export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Discount = {
  name: string;
  percentage: number;
};

export class Cart {
  private cart: Product[];
  private availableDiscounts: Discount[] = [];
  private discountPercentage = 0;

  constructor(initialValue: Product[] = [], discounts: Discount[] = []) {
    this.cart = initialValue;
    this.availableDiscounts = discounts;
  }

  get content() {
    return this.cart;
  }

  addProduct(product: Product): void {
    this.cart.push(product);
  }

  removeProduct(id: string): void {
    const index = this.cart.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.cart.splice(index, 1);
    } else {
      throw new Error(`Product with id ${id} not found in cart`);
    }
  }

  getProductCount(): number {
    return this.cart.reduce((acc, product) => acc + product.quantity, 0);
  }

  getTotalPrice(): number {
    return (
      this.cart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ) *
      (1 - this.discountPercentage / 100)
    );
  }

  applyDiscount(code: string): void {
    const discount = this.availableDiscounts.find((d) => d.name === code);
    if (discount) {
      this.discountPercentage += discount.percentage;
      this.availableDiscounts = this.availableDiscounts.filter(
        (d) => d.name !== code,
      );
    } else {
      throw new Error(`Discount code ${code} not found`);
    }
  }
}
