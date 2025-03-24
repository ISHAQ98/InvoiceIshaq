import { ReactNode } from "react";
import { requireUser } from "../utils/hooks";

// import Logo from "@/public/channel_logo.png";

import Image from "next/image";
import Link from "next/link";
import { DashBoardLinks } from "../components/DashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "../utils/auth";
import prisma from "../utils/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
    },
  });

  if (!data?.firstName || !data?.lastName || !data?.address) {
    redirect("/onboarding");
  }
}
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  const data = await getUser(session.user?.id as string);
  return (
    <>
      <div className="grid  min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
        <div className="hidden border-r bg-muted/70 md:block ">
          <div className="flex flex-col max-h-screen h-full gap-2 ">
            <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6 ">
              <Link href="/" className="flex items-center   gap-2">
                <Image
                  className=" bg-indigo-200  shadow-indigo-600 shadow-[1px_2px_15px_0.1px]"
                  src="/channel_logo.png"
                  alt="logo "
                  style={{ borderRadius: "10px" }}
                  width={32}
                  height={32}
                />
                <p className="text-[20px] font-bold font-mono ">
                  Invoice
                  <span className=" text-indigo-700 ">Ishaq</span>
                </p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <DashBoardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14  items-center gap-4 border-b bg-muted/70 lg:h-[60px] px-4 lg:px-6  ">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-2 mt-40">
                  <DashBoardLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center ml-auto ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-full "
                    variant="outline"
                    size="icon"
                  >
                    <User2 />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/invoices">Invoices</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <button className="w-full text-left">Log out</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 ">{children}</main>
        </div>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
