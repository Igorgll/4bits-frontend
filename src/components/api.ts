const logoutClient = async (): Promise<void> => {
  const token = localStorage.getItem('sessionToken');
  const response = await fetch('http://localhost:8080/api/v1/users/clientLogout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': token ? token : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to logout');
  }

  localStorage.removeItem('sessionToken');
};

export { logoutClient };
