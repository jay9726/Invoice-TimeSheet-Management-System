import type React from "react";
import Icon from "../icon";

interface timeSheetProps {
  status: string
}

const TimesheetStatusBadge: React.FC<timeSheetProps> = ({ status }) => {
  if (status === "SUBMITTED") return <Icon name='submitIcon' />;
  if (status === "APPROVED") return <Icon name='approvalIcon' />;
  if (status === "REJECTED") return <Icon name='rejectedIcon' />;
  if (status === 'DRAFT') return <Icon name='draftIcon' />;
}

export default TimesheetStatusBadge
