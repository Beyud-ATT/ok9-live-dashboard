import { useQuery } from "@tanstack/react-query";
import { getDetailLivestream } from "../services/livestreamAPI";
import { toast } from "react-toastify";

export default function useLiveDetail(id) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["live-detail", id],
    queryFn: () => getDetailLivestream(id),

    // staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
