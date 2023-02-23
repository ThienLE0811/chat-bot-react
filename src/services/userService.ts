import axios from "axios"

const handleLoginApi = async (username:string, password:string) => {
    return await axios.post("http://localhost:8000/users/login", {
        username,
        password,
      })
}

const handleLogoutApi = async () => {
  try {
    const response = await axios.post('http://localhost:8000/users/logout');
    console.log("data logout::",response.data);
  } catch (error) {
    console.error(error);
  }
};

const handleSingUpApi = async (username:string, password:string, email:string) => {
  return await axios.post("http://localhost:8000/users/register", {
        username,
        password,
        email,
      })
};

export { handleLoginApi,handleLogoutApi,handleSingUpApi }