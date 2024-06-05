export const addItemToCart = async (productId: number, quantity: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/cart/addItem/${productId}?quantity=${quantity}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }
};

export const removeItemFromCart = async (shoppingCartId: number, productId: number, quantity: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/cart/removeItem/${shoppingCartId}/${productId}?quantity=${quantity}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove item from cart");
  }
};

export const getCartItems = async (shoppingCartId: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/cart/viewCart/${shoppingCartId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch cart items");
  }
  const data = await response.json();
  return data.items.map((item: any) => ({
    productId: item.product.productId,
    productName: item.product.productName,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.productImages[0] ? `data:image/jpeg;base64,${item.product.productImages[0].imageData}` : '', // Adiciona a imagem
  }));
};

export const increaseItemQuantity = async (shoppingCartId: number, productId: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/cart/increaseItem/${shoppingCartId}/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to increase item quantity in cart");
  }
};

export const decreaseItemQuantity = async (shoppingCartId: number, productId: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/cart/decreaseItem/${shoppingCartId}/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to decrease item quantity in cart");
  }
};
