import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import viVN from "antd/lib/locale/vi_VN";
import { setupApiEnvelope } from "./lib/apiEnvelope";
import { setupAxiosAuth } from "./lib/auth";

setupApiEnvelope();
setupAxiosAuth();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConfigProvider locale={viVN}>
    <App />
  </ConfigProvider>
);

reportWebVitals();
