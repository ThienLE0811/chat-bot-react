import axios from "axios"

const parseMessage= async():Promise<any[]> =>{
    const data = { 
        text: 'hello',
        message_id: 'b2831e73-1407-4ba0-a861-0f30a42a2a5a'
    }
    // const jsonString = JSON.stringify(data)
    // console.log("data: ",jsonString)
    try {
    const response = await axios.post("http://localhost:8000/parseMessage",
        data
    );
    console.log("res:: ",response)
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
 
  }

  export { parseMessage }