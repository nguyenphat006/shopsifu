import {
  ToastContainer,
  toast,
  ToastOptions,
  ToastPosition,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning",
  options: ToastOptions = {}
) => {
  const toastOptions: ToastOptions = {
    position: "top-right" as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    ...options,
  };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "info":
      toast.info(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

export const Toast = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
);
