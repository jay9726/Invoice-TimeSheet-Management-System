import { Badge } from "@/components/ui/badge";
import type React from "react";

interface invoiceStatusProps {
  status: string;
}


export const InvoiceStatusBadge: React.FC<invoiceStatusProps> = ({ status }) => {
  switch (status) {
    case "NOT_GENERATED":
      return (
        <Badge className="bg-white text-primary border-gray-300">
          Not Generated
        </Badge>
      );

    case "DRAFT":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          Draft
        </Badge>
      );

    case "SUBMITTED":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Submitted
        </Badge>
      );

    case "FINALIZED":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          Finalized
        </Badge>
      );

    case "PAID":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          Paid
        </Badge>
      );

    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};