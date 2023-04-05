import axios from "axios"


const getPermission = async () => {
  return await axios.get("http://localhost:8000/roleService/role/getList", {})
};

// const deletePermission = async (userId:number) => {
//   return await axios.delete(`http://localhost:8000/users/delete/${userId}`, {})
// };

// const createUser = async (formValues:any) => {
//   return await axios.post(`http://localhost:8000/users/create`,formValues)
// };

const updatePermission = async (id:string,formValues:any) => {
  return await axios.put(`http://localhost:8000/roleService/role/update/${id}`,formValues)
};



export { getPermission, updatePermission }