import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPinMsg } from "../services/dashBoard";
import { toast } from "react-toastify";

export default function useAddPinMsg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPinMsg,
    onSuccess: () => {
      toast.success("Ghim tin nhắn thành công!");
      queryClient.invalidateQueries({ queryKey: ["pinMsg"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in addPinMsg:", error);
    },
  });
}
