import { message, notification } from "antd";
import axios from "axios"

const testIntent = async (): Promise<any> => {
  try {
    const response = await axios.get("https://c3d2-118-70-132-104.ngrok-free.app/customer/all", {
      headers: {
        'Access-Control-Allow-Origin' : '*'
      }
    });
    console.log("res11:: ",response)
    if(response?.status === 200){
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


const getIntent = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/intents/getList", {});
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

const createIntent = async (formValues:any) => {
  return await axios.post(`http://localhost:8000/intents/create`,formValues)
};

const updateIntent = async (id:string,formValues:any) => {
  return await axios.put(`http://localhost:8000/intents/update/${id}`,formValues)
};

const deleteIntent = async (id:String) => {
  return await axios.delete(`http://localhost:8000/intents/delete/${id}`,{})
};

export { getIntent,updateIntent,deleteIntent,createIntent,testIntent }