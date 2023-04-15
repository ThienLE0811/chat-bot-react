import { message, notification } from "antd";
import axios from "axios"

// const getEntities = async () => {
//     const response = await axios.get("http://localhost:8000/entities/getList", {});
//     console.log("res:: ",response)
//     if(response.statusText === "OK"){
//       return response;
//     }
//     else {
//       message.error("Không lấy được dữ liệu")
//       return response
//     }
 
// };

const getEntities = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/entities/getList", {});
    console.log("res:: ",response)
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


const createEntities = async (formValues:any) => {
  return await axios.post(`http://localhost:8000/entities/create`,formValues)
};

const updateEntities = async (id:string,formValues:any) => {
  return await axios.put(`http://localhost:8000/entities/update/${id}`,formValues)
};

const deleteEntities = async (id:String) => {
  return await axios.delete(`http://localhost:8000/entitiess/delete/${id}`,{})
};

export { getEntities,updateEntities,deleteEntities,createEntities }