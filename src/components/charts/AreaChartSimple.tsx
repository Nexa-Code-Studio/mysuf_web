"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AreaChartSimpleProps<T> = {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
};

export default function AreaChartSimple<T extends Record<string, string | number>>({
  data,
  xKey,
  yKey,
}: AreaChartSimpleProps<T>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -10, right: 10 }}>
        <defs>
          <linearGradient id="areaPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E31837" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#E31837" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey={xKey as string} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <Tooltip cursor={{ stroke: "#E31837", strokeWidth: 1 }} />
        <Area type="monotone" dataKey={yKey as string} stroke="#E31837" fill="url(#areaPrimary)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
