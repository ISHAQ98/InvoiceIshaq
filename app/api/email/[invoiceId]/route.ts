import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });
    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.co",
      name: "ishaq SoloWebWiz",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "iszinelabidine@gmail.com" }],

      template_uuid: "67b6b39b-ff6a-4d2c-897f-21cb72a64c3e",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "InvoiceSoloWebWiz",
        company_info_address: "Rue street 123 ",
        company_info_city: "London",
        company_info_zip_code: "123456 ",
        company_info_country: "United Kingdom",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email Reminder." },
      { status: 500 }
    );
  }
}
