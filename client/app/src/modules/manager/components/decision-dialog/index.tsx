import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { managerDecisionDefaultValues } from "../../schemas/managerDefaultValues";
import type React from "react";
import { useAppSelector } from "@/lib/hooks";
import { useReviewSubmitManager } from "../../apis/mutation";
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication";
import { managerDecisionSchema, type managerDecisionPayload } from "../../schemas/managerSchema";
import { useToast } from "@/hooks/useToast";
import { decompressFromEncodedURIComponent } from "lz-string";



interface timesheetDecisionDialogProps {
  open: boolean;
  employeeId: string;
  onOpenChange: (v: boolean) => void;
};

const TimesheetDecisionDialog: React.FC<timesheetDecisionDialogProps> = ({ open, onOpenChange, employeeId }) => {

  const toast = useToast();
  const seletedTimeSheet = useAppSelector((state: any) => state.timeSheet.timeSheet)

  const { control, handleSubmit } = useForm<managerDecisionPayload>({
    resolver: zodResolver(managerDecisionSchema),
    defaultValues: managerDecisionDefaultValues,
  });


  const { mutate: employeeReview, isPending: reviewing } = useReviewSubmitManager();

  const session = SessionAuthentication.getSession();
  const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);

  const submit = async (formData: managerDecisionPayload) => {
    const payload = {
      employeeId: employeeId,
      timesheetId: seletedTimeSheet,
      action: formData.action,
      comment: formData.comment
    }
    employeeReview({ managerId: decrpyEmployeeId, payload },
      {
        onSuccess: () => {
          onOpenChange(false);
          location.reload();
          toast.success("TimeSheet Send Successfully!!!")

        },
        onError: (err) => {
          onOpenChange(false);
          toast.error(err.message)
        }
      }
    )
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve / Reject Timesheet</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Controller
            control={control}
            name="action"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Select value={field.value} onValueChange={field.onChange} disabled={reviewing}>
                  <SelectTrigger className="min-w-full">
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Approve</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="comment"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Write a comment..."
                  disabled={reviewing}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <DialogFooter className="gap-4">
            <Button type="button" variant="outline" className="cursor-pointer" disabled={reviewing} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={reviewing}>{reviewing ? "Submitting..." : "Submit"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default TimesheetDecisionDialog;