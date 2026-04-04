import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type React from "react";
import { invoiceSchema, type invoicePayload } from "../../schemas/invoiceSchema";
import { invoiceDefaultValues } from "../../schemas/invoiceDefaultValues";
import { useUpdateInvoiceStatus } from "../../apis/mutation";
import { useToast } from "@/hooks/useToast";



interface invoiceDecisionDialogProps {
    open: boolean;
    invoiceId: string;
    onOpenChange: (v: boolean) => void;
};

const InvoiceDecisionDialog: React.FC<invoiceDecisionDialogProps> = ({ open, onOpenChange, invoiceId }) => {

    const toast = useToast();

    const { control, handleSubmit } = useForm<invoicePayload>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: invoiceDefaultValues,
    });

    const { mutate: updateInvoice, isPending: isUpdating } = useUpdateInvoiceStatus();

    const onSubmit = async (formData: invoicePayload) => {
        updateInvoice({ invoiceId: invoiceId, status: formData.invoiceDecision }, {
            onSuccess: () => {
                toast.success("Invoice Updated Successfully");
                onOpenChange(false)
            },
            onError: () => {
                toast.error("Something went wrong");
                onOpenChange(true)
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>FINALIZED / PAID INVOICE</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="invoiceDecision"
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                    <SelectTrigger className="min-w-full">
                                        <SelectValue placeholder="Select Decision" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FINALIZED">FINALIZED</SelectItem>
                                        <SelectItem value="PAID">PAID</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <DialogFooter className="gap-4">
                        <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="cursor-pointer">{isUpdating ? "Updating..." : "Submit"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default InvoiceDecisionDialog;