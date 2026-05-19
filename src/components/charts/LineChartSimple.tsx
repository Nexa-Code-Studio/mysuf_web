"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type LineChartSimpleProps<T> = {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
};

export default function LineChartSimple<T extends Record<string, string | number>>({
  data,
  xKey,
  yKey,
}: LineChartSimpleProps<T>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey={xKey as string} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <Tooltip cursor={{ stroke: "#E31837", strokeWidth: 1 }} />
        <Line type="monotone" dataKey={yKey as string} stroke="#E31837" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
