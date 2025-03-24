import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

// styling color generator
const tailwindColors = [
  "bg-red-300",
  "bg-blue-300",
  "bg-green-300",

  "bg-purple-300",
  "bg-pink-300",
  "bg-indigo-300",
  "bg-teal-300",
  "bg-orange-300",
];

function getRandomTailwindColor() {
  return tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
}

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
}

export async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 ">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center flex-wrap min-w-0 gap-4"
          >
            <Avatar className="hidden sm:flex  size-9">
              <AvatarFallback
                className={`text-xs ${getRandomTailwindColor()} `}
              >
                {item.clientName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-none">
                {item.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.clientEmail}
              </p>
            </div>
            <div className="ml-auto font-medium  text-xs md:text-sm whitespace-nowrap ">
              +
              {formatCurrency({
                amount: item.total,
                currency: item.currency as any,
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
