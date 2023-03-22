import { message } from "antd";
import axios from "axios"

const getIntent = async () => {
    const response = await axios.get("http://localhost:8000/intents/getList", {});
    console.log("res:: ",response)
    if(response.statusText === "OK"){
      return response;
    }
    else {
      message.error("Không lấy được dữ liệu")
      return response
    }
 
};

const createIntent = async (formValues:any) => {
  return await axios.post(`http://localhost:8000/intents`,formValues)
};

const updateIntent = async (id:string,formValues:any) => {
  return await axios.put(`http://localhost:8000/intents/${id}`,formValues)
};

const deleteIntent = async (id:String) => {
  return await axios.delete(`http://localhost:8000/intents/delete/${id}`,{})
};

export { getIntent,updateIntent,deleteIntent,createIntent }