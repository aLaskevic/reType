const BASE_URL = "https://random-word-api.herokuapp.com";

export const fetchData = async (endpoint: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Network response was not ok :(");
  }

  const data = await response.json();

  return data;
};
