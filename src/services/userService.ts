import axios from "axios"


const handleLoginApi = (username:string, password:string) => {
    return axios.post("http://localhost:8000/users/login", {
        username,
        password,
      })
}

export { handleLoginApi }