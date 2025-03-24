"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type iAppProps = {
  data: { date: string; amount: number }[];
};
export function Chart({ data }: iAppProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={true}
            axisLine={false}
            tickMargin={5}
          />
          <YAxis />
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent indicator="dot" />}
          />

          <Area
            dataKey="amount"
            type="natural"
            fill="var(--chart-2)"
            fillOpacity={0.5}
            stroke="var(--chart-2)"
            stackId="a"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// const data = [
//   { date: "Mar 5", amount: "60" },
//   { date: "Mar 7", amount: "150" },
//   { date: "Mar 10", amount: "600" },
// ];

// export function Chart() {
//   return (
//     <ChartContainer
//       config={{
//         amount: {
//           label: "Amount",
//           color: "hsl(var(--primary))",
//         },
//       }}
//       className="min-h-[300px]"
//     >
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={data}>
//           <XAxis dataKey="date" />
//           <YAxis />
//           <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
//           <Line
//             type="monotone"
//             dataKey="amount"
//             stroke=" var(--popover-foreground)
// "
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   );
// }
