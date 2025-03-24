"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      invoiceName: submission.value.invoiceName,
      fromName: submission.value.fromName,
      fromEmail: submission.value.formEmail,
      fromAddress: submission.value.fromAddress,

      date: submission.value.date,
      status: submission.value.status,
      total: submission.value.total,
      dueDate: submission.value.dueDate,

      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,

      currency: submission.value.currency,
      invoiceNumber: submission.value.invoiceNumber,
      note: submission.value.note,

      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      userId: session.user?.id,
    },
  });

  const sender = {
    email: "hello@demomailtrap.co",
    name: "ishaq SoloWebWiz",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "iszinelabidine@gmail.com" }],
    template_uuid: "046e677b-b026-4a35-ac98-8446e9cfa700",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink: ` http://localhost:3000/api/invoice/${data.id}`,
    },
  });

  redirect("/dashboard/invoices");
}

export async function updateInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      invoiceName: submission.value.invoiceName,
      fromName: submission.value.fromName,
      fromEmail: submission.value.formEmail,
      fromAddress: submission.value.fromAddress,

      date: submission.value.date,
      status: submission.value.status,
      total: submission.value.total,
      dueDate: submission.value.dueDate,

      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,

      currency: submission.value.currency,
      invoiceNumber: submission.value.invoiceNumber,
      note: submission.value.note,

      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
    },
  });

  const sender = {
    email: "hello@demomailtrap.co",
    name: "ishaq SoloWebWiz",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "iszinelabidine@gmail.com" }],
    template_uuid: "e7531849-2332-4a84-ab4c-8b551c9f6743",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink: ` http://localhost:3000/api/invoice/${data.id}`,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
  });
  return redirect("/dashboard/invoices");
}

export async function markAsPaid(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
    data: {
      status: "PAID",
    },
  });
  return redirect("/dashboard/invoices");
}
