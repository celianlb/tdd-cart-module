import { z } from "zod";

export const Product = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const Discount = z.object({
  name: z.string(),
  percentage: z.number().int().min(0).max(100),
});

export class Cart {
  private cart: z.infer<typeof Product>[];
  private availableDiscounts: z.infer<typeof Discount>[] = [];
  private discountPercentage = 0;

  constructor(
    initialValue: z.infer<typeof Product>[] = [],
    discounts: z.infer<typeof Discount>[] = [],
  ) {
    Product.array().parse(initialValue);
    Discount.array().parse(discounts);
    this.cart = initialValue;
    this.availableDiscounts = discounts;
  }

  get content() {
    return this.cart;
  }

  addProduct(product: z.infer<typeof Product>): void {
    Product.parse(product);
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
