"use client";

import { Customer } from "../schemas/customers";
import { Badge } from "@/components/ui/badge";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

export const CustomerHeader = ({ customer }: { customer: Customer }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl flex items-center gap-2">
        {customer.CUSTOMERNAME}
        <Badge variant="outline" className="ml-2">
          ID: {customer.CUSTOMER}
        </Badge>
      </DialogTitle>
      <DialogDescription className="flex items-center gap-2">
        <span>
          {customer.CITY}, {customer.STATECODE}
        </span>
        <span className="text-xs">•</span>
        <span>Created: {formatDate(customer.CREATEDATE)}</span>
      </DialogDescription>
    </DialogHeader>
  );
};
