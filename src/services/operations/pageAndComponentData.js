import { toast } from "react-hot-toast";
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId, dispatch) => {
  const toastId = toast.loading("Loading courses...");
  dispatch(setProgress(50));
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      catalogData.CATALOGPAGEDATA_API,
      null,            // body
      null,            // headers
      { categoryId }   // query params
    );

    console.log("CATALOG PAGE DATA API RESPONSE....", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unknown error");
    }

    result = response.data;
  } catch (error) {
    console.error("CATALOG PAGE DATA API ERROR....", error);

    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";

    toast.error(errorMessage);

    result = {
      success: false,
      message: errorMessage,
    };
  }

  toast.dismiss(toastId);
  dispatch(setProgress(100));
  return result;
};

