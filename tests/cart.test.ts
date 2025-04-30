import { Cart } from "src/cart";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

describe("cart module", () => {
  it("should add a product to the cart", () => {
    const cart = new Cart();
    expect(cart.content).toStrictEqual([]);

    cart.addProduct({
      id: "test01",
      name: "Test Product",
      price: 100,
      quantity: 1,
    });
    expect(cart.content).toStrictEqual([
      {
        id: "test01",
        name: "Test Product",
        price: 100,
        quantity: 1,
      },
    ]);

    cart.addProduct({
      id: "test02",
      name: "Test Product 2",
      quantity: 3,
      price: 100,
    });
    expect(cart.content.length).toBe(2);
    expect(cart.content).toStrictEqual([
      {
        id: "test01",
        name: "Test Product",
        price: 100,
        quantity: 1,
      },
      {
        id: "test02",
        name: "Test Product 2",
        quantity: 3,
        price: 100,
      },
    ]);

    try {
      cart.addProduct({
        id: "test01",
        name: "Test Product",
        price: -10,
        quantity: 1,
      });
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
    }

    try {
      cart.addProduct({
        id: "test01",
        name: "Test Product",
        price: 10,
        quantity: 0,
      });
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
    }

    try {
      cart.addProduct({
        id: "test01",
        name: "Test Product",
        price: 10,
        quantity: -1,
      });
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
    }
  });

  it("should remove a product from the cart", () => {
    const cart = new Cart([
      { id: "1", name: "test1", price: 100, quantity: 1 },
      { id: "2", name: "test2", price: 200, quantity: 2 },
      { id: "3", name: "test3", price: 300, quantity: 3 },
    ]);
    expect(cart.content).toStrictEqual([
      { id: "1", name: "test1", price: 100, quantity: 1 },
      { id: "2", name: "test2", price: 200, quantity: 2 },
      { id: "3", name: "test3", price: 300, quantity: 3 },
    ]);

    cart.removeProduct("2");
    expect(cart.content).toStrictEqual([
      { id: "1", name: "test1", price: 100, quantity: 1 },
      { id: "3", name: "test3", price: 300, quantity: 3 },
    ]);

    cart.removeProduct("1");
    expect(cart.content).toStrictEqual([
      { id: "3", name: "test3", price: 300, quantity: 3 },
    ]);

    try {
      cart.removeProduct("doesnotexist");
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      // @ts-ignore
      expect(e.message).toBe("Product with id doesnotexist not found in cart");
    }

    try {
      cart.removeProduct("1");
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      // @ts-ignore
      expect(e.message).toBe("Product with id 1 not found in cart");
    }

    expect(cart.content).toStrictEqual([
      { id: "3", name: "test3", price: 300, quantity: 3 },
    ]);
  });

  it("should get the product count", () => {
    const cart = new Cart([
      { id: "1", name: "test1", price: 100, quantity: 1 },
      { id: "2", name: "test2", price: 200, quantity: 2 },
      { id: "3", name: "test3", price: 300, quantity: 3 },
    ]);
    expect(cart.getProductCount()).toBe(6);
    cart.addProduct({ id: "4", name: "test4", price: 400, quantity: 4 });
    expect(cart.getProductCount()).toBe(10);
    cart.removeProduct("2");
    expect(cart.getProductCount()).toBe(8);
  });

  it("should apply discounts", () => {
    const cart = new Cart(
      [],
      [
        { name: "10% off", percentage: 10 },
        { name: "20% off", percentage: 20 },
      ],
    );
    expect(cart.getTotalPrice()).toBe(0);

    cart.addProduct({ id: "1", name: "test1", price: 100, quantity: 1 });
    expect(cart.getTotalPrice()).toBe(100);

    cart.applyDiscount("10% off");
    expect(cart.getTotalPrice()).toBe(90);

    cart.applyDiscount("20% off");
    expect(cart.getTotalPrice()).toBe(70);

    expect(cart.content).toStrictEqual([
      { id: "1", name: "test1", price: 100, quantity: 1 },
    ]);

    cart.addProduct({ id: "2", name: "test2", price: 200, quantity: 2 });
    expect(cart.getTotalPrice()).toBe((100 + 400) * 0.7);

    try {
      cart.applyDiscount("nonexistent");
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      // @ts-ignore
      expect(e.message).toBe("Discount code nonexistent not found");
    }

    try {
      cart.applyDiscount("10% off");
      throw new Error("This should not be reached");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      // @ts-ignore
      expect(e.message).toBe("Discount code 10% off not found");
    }
  });
});
