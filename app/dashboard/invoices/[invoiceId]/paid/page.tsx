import { markAsPaid } from "@/app/actions";
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

export default async function MarkAsPaidRoute({ params }: { params: Params }) {
  const session = await requireUser();
  const { invoiceId } = await params;

  await Authorize(invoiceId, session.user?.id as string);

  return (
    <div className="flex  flex-1 justify-center  items-center">
      <Card className="max-w-[500px] mx-auto text-center">
        <CardHeader>
          <CardTitle>Mark as Paid?</CardTitle>
          <CardDescription>
            ✅ 💳 Are you sure you want to mark this invoice as paid?
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
              await markAsPaid(invoiceId);
            }}
          >
            <SubmitBtn variant={"destructive"} text="Mark as paid!" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
