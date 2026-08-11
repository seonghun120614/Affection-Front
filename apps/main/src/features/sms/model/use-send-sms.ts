import { api } from "@affection/api";
import { useMutation } from "@tanstack/react-query";
import { type SendSmsRequest } from "@/entities";

export const useSendSms = () => {
    return useMutation({
        mutationFn: async (body: SendSmsRequest): Promise<void> =>
            api.postNoContent(`/api/sms/send`, body) as Promise<void>,
        onSuccess: (data) => console.log(data),
        onError: (error) => console.error(error),
    });
};
