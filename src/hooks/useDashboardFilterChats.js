import { toast } from "react-toastify";
import { filterChats } from "../services/dashBoard";
import { useMutation } from "@tanstack/react-query";

export default function useDashboardFilterChats() {
  return useMutation({
    mutationKey: ["filterChats"],
    mutationFn: filterChats,
    onSuccess: () => {
      toast.success("Lọc chat thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in filterChats:", error);
    },
  });
}
