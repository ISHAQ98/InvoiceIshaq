"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCheckIcon,
  DownloadCloudIcon,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface iAppProps {
  invoiceId: string;
  status: string;
}

export function InvoiceActions({ invoiceId, status }: iAppProps) {
  const handleSendReminder = () => {
    toast.promise(
      fetch(`/api/email/${invoiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      {
        loading: "Sending Reminder Email...",
        success: "Reminder email sent successfully",
        error: "Failed to send reminder email",
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/invoices/${invoiceId}`}>
            <Pencil className="size-4 mr-2" />
            Edit Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/api/invoice/${invoiceId}`} target="_blank">
            <DownloadCloudIcon className="size-4 mr-2" />
            Download Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendReminder}>
          <Mail className="size-4 mr-2" />
          Remainder Email
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/invoices/${invoiceId}/delete`}>
            <Trash className="size-4 mr-2" />
            Delete Invoice
          </Link>
        </DropdownMenuItem>
        {status !== "PAID" && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${invoiceId}/paid`}>
              <CheckCheckIcon className="size-4 mr-2" />
              Mark as Paid
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
