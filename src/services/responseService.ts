import { message, notification } from "antd";
import axios from "axios"

// const getResponse = async () => {
//     const response = await axios.get("http://localhost:8000/responses/getList", {});
//     console.log("res:: ",response)
//     if(response.statusText === "OK"){
//       return response;
//     }
//     else {
//       message.error("Không lấy được dữ liệu")
//       return response
//     }
 
// };

const getResponse = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/responses/getList", {});
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

const createResponse = async (formValues:any) => {
  return await axios.post(`http://localhost:8000/responses/create`,formValues)
};

const updateResponse = async (id:string,formValues:any) => {
  return await axios.put(`http://localhost:8000/responses/update/${id}`,formValues)
};

const deleteResponse = async (id:String) => {
  return await axios.delete(`http://localhost:8000/responsess/delete/${id}`,{})
};

export { getResponse,updateResponse,deleteResponse,createResponse }