import { message } from "antd";
import axios from "axios";

const trainModel = async (): Promise<any[]> => {
  // const jsonString = JSON.stringify(data)
  // console.log("data: ",jsonString)
  try {
    const response = await axios.get("http://localhost:8000/getAllData", {
      headers: {
        "Content-Type": "application/yaml",
        Accept: "*",
      },
    });
    // message.loading("Tiến trình train bắt đầu");
    console.log("res:: ", response.headers);
    return response.data;
  } catch (error) {
    console.log(error);
    message.error("Train không thành công!");
    return [];
  }
};

const parseMessage = async (value: string): Promise<any[]> => {
  const data = {
    text: "hello",
    message_id: "b2831e73-1407-4ba0-a861-0f30a42a2a5a",
  };
  // const data = { value };
  // const jsonString = JSON.stringify(data)
  // console.log("data: ",jsonString)
  try {
    const response = await axios.post(
      "http://localhost:8000/parseMessage",
      value
    );
    console.log("res:: ", response);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { parseMessage, trainModel };
