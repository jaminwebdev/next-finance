import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Accounts deleted!")
            // invalidate get accounts endpoint and refetch accounts after account is created
            queryClient.invalidateQueries({ queryKey: ["accounts"]})
            // TODO: alslo invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete accounts")
        }
    })

    return mutation;
}