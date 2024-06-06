export const getUserIdByEmail = async (email: string): Promise<number> => {
  const response = await fetch(`http://localhost:8080/api/v1/users/email/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": localStorage.getItem("authToken") || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user ID");
  }

  const data = await response.json();
  if (!data || !data.userId) {
    throw new Error("User ID not found");
  }
  return data.userId;
};

export const createOrder = async (shoppingCartId: number): Promise<Response> => {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    throw new Error("User email not found");
  }

  const userId = await getUserIdByEmail(userEmail);

  const response = await fetch(`http://localhost:8080/api/v1/orders/create?userId=${userId}&shoppingCartId=${shoppingCartId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": localStorage.getItem("authToken") || "",
    },
  });

  return response;
};
