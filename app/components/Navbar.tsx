import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/channel_logo.png";

export function Navbar() {
  return (
    <div className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center   gap-2">
        <Image
          className=" bg-indigo-200 size-10  shadow-indigo-600 shadow-[1px_2px_15px_0.1px]"
          src={Logo}
          alt="Logo Image "
          style={{ borderRadius: "10px" }}
        />
        <h3 className="text-3xl font-bold ">
          Invoice
          <span className="-mt-2 bg-gradient-to-r to-teal-500 from-indigo-600 text-transparent bg-clip-text ">
            Ishaq
          </span>
        </h3>
      </Link>
      <Link
        className="block -mt-2 bg-gradient-to-r  to-teal-500 from-indigo-700  font-bold text-white py-[6px] px-4 rounded  shadow-indigo-600 shadow-[1px_2px_10px_0.1px] hover:-translate-y-0.5 hover:transition-all "
        href="/login"
      >
        Get Started
      </Link>
    </div>
  );
}
