"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SelectValue } from "@radix-ui/react-select";
import { CalendarIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { SubmitBtn } from "./SubmitBtn";
import { updateInvoice } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "../utils/zodSchemas";
import { formatCurrency } from "../utils/formatCurrency";
import { Prisma } from "@prisma/client";

interface iAppProps {
  data: Prisma.InvoiceGetPayload<{}>;
}

export function EditInvoice({ data }: iAppProps) {
  const [lastResult, formAction] = useActionState(updateInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [selectedDate, setSelectedDate] = useState(data.date);
  const [currency, setCurrency] = useState(data.currency);
  const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
  const [rate, setRate] = useState(data.invoiceItemRate.toString());

  let calcTotal = (+quantity || 0) * (+rate || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        <form
          action={formAction}
          id={form.id}
          onSubmit={form.onSubmit}
          noValidate
        >
          <input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />

          <input type="hidden" name={fields.total.name} value={calcTotal} />
          <input type="hidden" name="id" value={data.id} />

          <div className="flex flex-col gap-1 w-fit mb-6 ">
            <div className="flex items-center gap-4">
              <Badge variant={"secondary"}>Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={data.invoiceName}
                placeholder="test "
              />
            </div>
            <p className="text-red-500 text-sm  ">
              {fields.invoiceName.errors}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label>Invoice No.</Label>
              <div className="flex  py-2">
                <span className="px-3 border-r-0 rounded-l-md bg-muted flex items-center ">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={data.invoiceNumber}
                  className="rounded-l-none"
                  placeholder="3"
                />
              </div>
              <p className="text-red-500 text-sm  ">
                {fields.invoiceName.errors}
              </p>
            </div>
            <div>
              <Label className="pb-2">Currency</Label>
              <Select
                name={fields.currency.name}
                key={fields.currency.key}
                value={currency}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.currency.errors}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="my-2">From</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  placeholder="Your Name"
                  defaultValue={data.fromName}
                />
                <p className="text-sm text-red-500">{fields.fromName.errors}</p>
                <Input
                  name={fields.formEmail.name}
                  key={fields.formEmail.key}
                  placeholder="Your Email"
                  defaultValue={data.fromEmail}
                />
                <p className="text-sm text-red-500">
                  {fields.formEmail.errors}
                </p>
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  placeholder="Your Address"
                  defaultValue={data.fromAddress}
                />
                <p className="text-sm text-red-500">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>
            <div>
              <Label className="my-2">To</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={data.clientName}
                  placeholder="Client Name"
                />
                <p className="text-sm text-red-500">
                  {fields.clientName.errors}
                </p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={data.clientEmail}
                  placeholder="Client Email"
                />
                <p className="text-sm text-red-500">
                  {fields.clientEmail.errors}
                </p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={data.clientAddress}
                  placeholder="Client Address"
                />
                <p className="text-sm text-red-500">
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6 ">
            <div>
              <Label className="my-2">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon />
                    {selectedDate ? (
                      new Intl.DateTimeFormat("en-US", {
                        dateStyle: "long",
                      }).format(selectedDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-red-500">{fields.date.errors}</p>
            </div>

            <div>
              <Label className="my-2">Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={data.dueDate.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 3O</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">{fields.dueDate.errors}</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2 pl-1">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={data.invoiceItemDescription}
                  placeholder="Item name & description"
                />
                <p className="text-sm text-red-500">
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className="col-span-2 pl-1">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p className="text-sm text-red-500">
                  {fields.invoiceItemQuantity.errors}
                </p>
              </div>
              <div className="col-span-2 ">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  type="number"
                  placeholder="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <p className="text-sm text-red-500">
                  {fields.invoiceItemRate.errors}
                </p>
              </div>
              <div className="col-span-2 ">
                <Input
                  value={formatCurrency({
                    amount: calcTotal,
                    currency: currency as any,
                  })}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>
                  {formatCurrency({
                    amount: calcTotal,
                    currency: currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-3">
                  {formatCurrency({
                    amount: calcTotal,
                    currency: currency as any,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="my-2">Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={data.note ?? undefined}
              placeholder="Add your Note's right here.."
            />
          </div>
          <div className="flex items-center justify-end my-6">
            <div>
              <SubmitBtn text="Update Invoice" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
