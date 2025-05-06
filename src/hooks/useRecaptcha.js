import { useMutation } from "@tanstack/react-query";
import { generateCaptcha } from "../services/authAPI";

export default function useRecaptcha() {
  return useMutation({
    mutationFn: generateCaptcha,
    onError: (error) => {
      console.error(
        error?.response?.data?.message || "Generate captcha failed"
      );
    },
  });
}
