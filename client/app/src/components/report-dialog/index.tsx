import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import Icon from "../icon";
import type { employee } from "@/types/employee";
import { useGenerateMonthlyReport } from "@/modules/manager/apis/mutation";
import Loader from "../loader";
import { useToast } from "@/hooks/useToast";
import ReportPdfViewer from "@/preview/ReportPdfViewer";
import { openPdfInNewTab } from "@/preview/open-pdf-in-tab";
import { generatePdfBlobUrl } from "@/preview/report-preview";


interface reportDialogProps {
  open: boolean;
  employee: employee | null;
  onOpenChange: (v: boolean) => void;
};

const ReportDialog: React.FC<reportDialogProps> = ({ open, onOpenChange, employee }) => {

  const toast = useToast();

  const [month, setMonth] = useState<string>("");

  const [pdfState, setPdfState] = useState<{ blobUrl: string; fileName: string } | null>(null);

  const monthOptions = useMemo(
    () =>
      [
        { label: "January", value: "01", },
        { label: "February", value: "02", },
        { label: "March", value: "03", },
        { label: "April", value: "04", },
        { label: "May", value: "05", },
        { label: "June", value: "06", },
        { label: "July", value: "07", },
        { label: "August", value: "08", },
        { label: "September", value: "09", },
        { label: "October", value: "10", },
        { label: "November", value: "11", },
        { label: "December", value: "12", },
      ]
    , [],
  );


  const { mutate: generateReport, isPending: isGeneratingReport } = useGenerateMonthlyReport();

  const onGenerate = () => {

    const payload = {
      employeeId: employee?.employeeId ?? "",
      month: Number(month),
      year: new Date().getFullYear(),
    };

    generateReport({ payload }, {
      onSuccess: (res) => {
        if (res.data.items.length === 0) {
          toast.info("No Data Found On Selected Month");
          return
        }

        const reportPayload = {
          employeeName: res.data?.employeeName ?? employee?.fullName ?? "Employee",
          billableHours: Number(res.data?.totalBillableHours ?? 0),

          weekStartDate: res.data?.actualStartDate ?? res.data?.startDate ?? "",
          weekEndDate: res.data?.actualEndDate ?? res.data?.endDate ?? "",

          rows: res.data.items.map((item: any) => ({
            client: item?.clientName ?? "-",
            project: item?.projectName ?? "-",
            billableHours: Number(item?.billableHours ?? 0),
          })),

          monthCount: 0,
        }
        const blobUrl = generatePdfBlobUrl(reportPayload);
        openPdfInNewTab(blobUrl, `Invoice-${reportPayload.employeeName}.pdf`)

        onOpenChange(false);
      },
      onError: () => {
        onOpenChange(false);
      },
    }
    );
  };


  if (isGeneratingReport) return <Loader />

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-md rounded-2xl p-0">
          <div className=" bg-primary/20 p-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                Generate Employee Report
              </DialogTitle>
              <DialogDescription className="text-sm text-black">
                Choose a month range and generate a PDF summary for{" "}
                <span className="font-medium text-foreground">
                  {employee?.fullName ?? ""}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Select Month</Label>
                <span className="text-red-500">*</span>
              </div>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                className="h-8 gap-2 hover:bg-primary/80 cursor-pointer"
                onClick={() => onGenerate()}
                disabled={!employee}
              >
                <Icon name="download" /> Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {pdfState && (
        <ReportPdfViewer
          blobUrl={pdfState.blobUrl}
          fileName={pdfState.fileName}
          onClose={() => {
            URL.revokeObjectURL(pdfState.blobUrl);
            setPdfState(null);
          }}
        />
      )}

    </>
  );
}

export default ReportDialog;