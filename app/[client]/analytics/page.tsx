'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const volumeData: any[] = [];
const courierData: any[] = [];
const rtoTrendData: any[] = [];
const exceptionData: any[] = [];

const volumeConfig = {
  total: { label: "Total Orders", color: "#94a3b8" },
  delivered: { label: "Delivered", color: "#10b981" },
};

const courierConfig = {
  success: { label: "Success %", color: "#f37a2a" },
  rto: { label: "RTO %", color: "#ef4444" },
};

const rtoConfig = {
  rate: { label: "RTO Rate %", color: "#f59e0b" },
};

const exceptionConfig = {
  unavailable: { label: "Customer Unavailable", color: "#3b82f6" },
  address: { label: "Address Not Found", color: "#f37a2a" },
  refused: { label: "Customer Refused", color: "#ef4444" },
  damaged: { label: "Damaged in Transit", color: "#8b5cf6" },
  routing: { label: "Hub Routing Error", color: "#10b981" },
};

export default function ClientAnalyticsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Analytics Overview</h1>
        <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">Actionable insights across your entire supply chain network.</p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Volume Trend Area Chart */}
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.16em] text-[#292F54] dark:text-[#ededdf]">7-Day Order Volume Trend</h2>
          <div className="h-72 w-full">
            <ChartContainer config={volumeConfig} className="h-full w-full">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-delivered)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-delivered)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-[#2a2e3d]" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-total)"
                  fill="url(#fillTotal)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="var(--color-delivered)"
                  fill="url(#fillDelivered)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </article>

        {/* Courier Performance Bar Chart */}
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.16em] text-[#292F54] dark:text-[#ededdf]">Courier Performance</h2>
          <div className="h-72 w-full">
            <ChartContainer config={courierConfig} className="h-full w-full">
              <BarChart data={courierData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-[#2a2e3d]" />
                <XAxis dataKey="courier" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="success" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rto" fill="var(--color-rto)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </article>

        {/* RTO Trend Line Chart */}
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.16em] text-[#292F54] dark:text-[#ededdf]">RTO Rate Decline</h2>
          <div className="h-72 w-full">
            <ChartContainer config={rtoConfig} className="h-full w-full">
              <LineChart data={rtoTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-[#2a2e3d]" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-rate)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </article>

        {/* Exceptions Pie Chart */}
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.16em] text-[#292F54] dark:text-[#ededdf]">Exception Breakdown</h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ChartContainer config={exceptionConfig} className="h-full w-full max-w-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={exceptionData}
                  dataKey="count"
                  nameKey="reason"
                  innerRadius={60}
                  outerRadius={100}
                  stroke="currentColor"
                  className="stroke-white dark:stroke-[#1e212b]"
                  strokeWidth={2}
                />
                <ChartLegend className="mt-4" content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </article>
      </section>
    </div>
  );
}
