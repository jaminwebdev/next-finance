import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { Loader } from "lucide-react";

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {

    const { isOpen, onClose, id } = useOpenAccount();

    const accountQuery = useGetAccount(id)
    const mutation = useCreateAccount();

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ''
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing account.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                ) : (
                    <AccountForm 
                    id={id}
                    onSubmit={onSubmit} 
                    disabled={mutation.isPending}
                    defaultValues={defaultValues}/>
                )}
            </SheetContent>
        </Sheet>
    )
}