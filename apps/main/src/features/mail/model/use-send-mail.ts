import { api } from "@affection/api";
import { SendMailRequest } from "@/entities";
import { useMutation } from "@tanstack/react-query";

export const useSendMail = () => {
    return useMutation({
        mutationFn: async (body: SendMailRequest): Promise<void> =>
            api.postNoContent(`/api/mail/send`, body),
        onSuccess: (data) => console.log(data),
        onError: (error) => console.error(error),
    });
};
