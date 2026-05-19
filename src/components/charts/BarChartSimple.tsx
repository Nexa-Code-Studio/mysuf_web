"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BarChartSimpleProps<T> = {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
};

export default function BarChartSimple<T extends Record<string, string | number>>({
  data,
  xKey,
  yKey,
}: BarChartSimpleProps<T>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey={xKey as string} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <Tooltip cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey={yKey as string} fill="#E31837" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
