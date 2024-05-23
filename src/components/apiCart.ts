export const addItemToCart = async (productId: number, quantity: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/cart/addItem/${productId}?quantity=${quantity}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};