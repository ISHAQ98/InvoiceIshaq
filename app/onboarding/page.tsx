"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitBtn } from "../components/SubmitBtn";
import { useActionState } from "react";
import { onboardUser } from "../actions";
// import { CheckCircle } from "lucide-react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../utils/zodSchemas";

export default function Onboarding() {
  const [lastResult, formAction] = useActionState(onboardUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <>
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
      </div>
      <div className="min-h-screen w-screen flex items-center justify-center">
        <Card className="max-w-sm mx-auto w-[500px ] text-center">
          <CardHeader>
            {/* <CheckCircle className="size-10 text-green-500" /> */}

            <CardTitle className="text-xl ">You are almost finished</CardTitle>
            <CardDescription>
              Enter Your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              action={formAction}
              id={form.id}
              onSubmit={form.onSubmit}
              noValidate
            >
              <div className="flex  justify-between gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Label>First Name</Label>
                  <Input
                    name={fields.firstName.name}
                    key={fields.firstName.key}
                    defaultValue={fields.firstName.initialValue}
                    placeholder="Your Name"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.firstName.errors}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Label>Last Name</Label>
                  <Input
                    name={fields.lastName.name}
                    key={fields.lastName.key}
                    defaultValue={fields.lastName.initialValue}
                    placeholder="Your Last Name"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.firstName.errors}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Label>Address</Label>
                <Input
                  name={fields.address.name}
                  key={fields.address.key}
                  defaultValue={fields.address.initialValue}
                  placeholder="street 123"
                />
                <p className="text-red-500 text-sm">
                  {fields.firstName.errors}
                </p>
              </div>
              <SubmitBtn text="Finish onboarding" />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
