import { notification } from "antd";
import axios from "axios"


// const getPermission = async () => {
//   return await axios.get("http://localhost:8000/roleService/role/getList", {})
// };


const getPermission = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/roleService/role/getList", {});
    if(response?.statusText === "OK"){
      
      return Promise.resolve(response);
    }
    else {
      notification.error({message: "Không lấy được dữ liệu"})
      return Promise.reject()
    }
  } catch (error) {
   notification.error({message: "Không lấy được dữ liệu"})
    return Promise.reject()
  }
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

const getPermissionRole:any = async () => {
  const response =  await axios.get("http://localhost:8000/roleService/role/getList", {})
  const roles = response.data.map((item:any) => {
          return { label: item?.description, value: item?.roleType };
        })
  // console.log("res::",roles); // [{label: "Admin", value:"Admin" }, {label: "User", value:"User" }]
  return roles
};



export { getPermission, updatePermission,getPermissionRole }


