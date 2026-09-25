import { notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

const testIntent = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "https://c3d2-118-70-132-104.ngrok-free.app/customer/all",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    console.log("res11:: ", response);
    if (response?.status === 200) {
      return Promise.resolve(response);
    } else {
      notification.error({ message: "Không lấy được dữ liệu" });
      return Promise.reject();
    }
  } catch (error) {
    notification.error({ message: "Không lấy được dữ liệu" });
    return Promise.reject();
  }
};

const getIntent = async (
  params: any,
  current: any,
  filters: any
): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/intents/getList", {
      params: { filters: params.title },
    });
    return {
      data: response.data,
      success: true,
      total: response?.data.length,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};

/** Throws on failure; the form shows the server's reason. */
const createIntent = async (formValues: any) => {
  return await axios.post(`http://localhost:8000/intents/create`, formValues);
};

const updateIntent = async (id: string, formValues: any) => {
  return await axios.put(
    `http://localhost:8000/intents/update/${id}`,
    formValues
  );
};

const deleteIntent = async (id: String) => {
  return await axios.delete(`http://localhost:8000/intents/delete/${id}`, {});
};

export interface IntentOption {
  /** Code Rasa trains and predicts, e.g. `ask_user_name`. */
  name: string;
  /** Vietnamese name shown to people, from the intent's description. */
  label?: string;
}

/** Intents to choose from, sorted by Vietnamese name. Throws on failure. */
const getIntentOptions = async (): Promise<IntentOption[]> => {
  try {
    const { data } = await axios.get<{ title: string; description?: string }[]>(
      `${API_URL}/intents/getList`
    );
    return data
      .map((intent) => ({
        name: intent.title,
        label: intent.description?.trim() || undefined,
      }))
      .sort((a, b) =>
        (a.label ?? a.name).localeCompare(b.label ?? b.name, "vi")
      );
  } catch {
    throw new Error("Không tải được danh sách ý định");
  }
};

export {
  getIntent,
  updateIntent,
  deleteIntent,
  createIntent,
  testIntent,
  getIntentOptions,
};
