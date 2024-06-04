import axios from "axios";
async function getUserById(selectedUserId: string | null) {
  try {
    const token = localStorage.getItem("authtoken");
    const Base_Url = import.meta.env.VITE_BACKEND_BASE_URL;
    const response = await axios.get(`${Base_Url}/user/${selectedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default getUserById;
