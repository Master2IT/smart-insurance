import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchFormStructure = async (type: string) => {
  try {
    const response = await api.get(`/api/insurance/forms?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching form structure:", error);
    throw error;
  }
};

export const submitForm = async (formData: any) => {
  try {
    const response = await api.post("/api/insurance/forms/submit", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const fetchSubmissions = async (params?: any) => {
  try {
    const response = await api.get("/api/insurance/forms/submissions", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
};

export const fetchStates = async (endpoint: string, params: any) => {
  try {
    const response = await api.get(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export default api;
