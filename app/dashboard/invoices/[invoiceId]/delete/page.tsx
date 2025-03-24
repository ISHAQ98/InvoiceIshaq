import { deleteInvoice } from "@/app/actions";
import { SubmitBtn } from "@/app/components/SubmitBtn";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { redirect } from "next/navigation";

async function Authorize(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }
}

type Params = Promise<{ invoiceId: string }>;

export default async function DeleteInvoiceRoute({
  params,
}: {
  params: Params;
}) {
  const session = await requireUser();
  const { invoiceId } = await params;
  await Authorize(invoiceId, session.user?.id as string);

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px] mx-auto text-center">
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>
            ⚠️ Are you sure that you want to delete this invoice?
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-3 justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/dashboard/invoices`}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteInvoice(invoiceId);
            }}
            id={invoiceId}
          >
            <SubmitBtn variant={"destructive"} text="Delete Invoice" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
