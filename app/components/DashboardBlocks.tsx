import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

async function getData(userId: string) {
  const [data, openInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
        currency: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);

  return {
    data,
    openInvoices,
    paidInvoices,
  };
}

export async function DashboardBlocks() {
  const session = await requireUser();
  const { data, openInvoices, paidInvoices } = await getData(
    session.user?.id as string
  );

  const blocks = [
    {
      title: "Total Revenue",
      icon: (
        <div className=" mx-auto flex size-10 items-center justify-center rounded-full 0 bg-amber-200  shadow-amber-600 shadow-[1px_2px_15px_0.1px] ">
          <DollarSign className="size-5 text-muted-foreground" />
        </div>
      ),
      text: "Base on Total Volume",

      value: formatCurrency({
        amount: data.reduce((acc, invoice) => +acc + +invoice.total, 0),
        currency: "USD",
      }),
    },
    {
      title: "Total Invoice Issued",
      icon: (
        <div className=" mx-auto flex size-10 items-center justify-center rounded-full 0  bg-cyan-200  shadow-cyan-600 shadow-[1px_2px_15px_0.1px] ">
          <Users className="size-5 text-muted-foreground" />
        </div>
      ),
      text: "Total Invoices Issued!",
      value: "+" + data.length,
    },
    {
      title: "Paid Invoices",
      icon: (
        <div className=" mx-auto flex size-10 items-center justify-center rounded-full 0 bg-green-200  shadow-green-600 shadow-[1px_2px_15px_0.1px] ">
          <CreditCard className="size-5 text-muted-foreground" />
        </div>
      ),
      text: "Total Invoices have been paid!",
      value: "+" + paidInvoices.length,
    },
    {
      title: "Pending Invoices",
      icon: (
        <div className=" mx-auto flex size-10 items-center justify-center rounded-full 0 bg-indigo-200  shadow-indigo-600 shadow-[1px_2px_15px_0.1px] ">
          <Activity className="size-5 text-muted-foreground" />
        </div>
      ),
      text: "Invoices which are currently pending!",
      value: "+" + openInvoices.length,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
      {blocks.map((block, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-col items-center justify-between space-y-0 gap-2 ">
            <CardTitle className="text-sm font-medium">{block.title}</CardTitle>

            {block.icon}
          </CardHeader>
          <CardContent className="text-center">
            <h2 className="text-xl font-bold ">{block.value}</h2>
            <p className="text-xs text-muted-foreground">{block.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
