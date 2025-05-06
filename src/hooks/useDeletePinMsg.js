import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePinMsg } from "../services/dashBoard";
import { toast } from "react-toastify";

export default function useDeletePinMsg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePinMsg,
    onSuccess: () => {
      toast.success("Xóa tin nhắn ghim thành công!");
      queryClient.invalidateQueries({ queryKey: ["pinMsg"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in deletePinMsg:", error);
    },
  });
}
