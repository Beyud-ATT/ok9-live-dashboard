import { useQuery } from "@tanstack/react-query";
import { getPinMsg } from "../services/dashBoard";
import { toast } from "react-toastify";

export default function useGetPinMsg() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["pinMsg"],
    queryFn: getPinMsg,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
