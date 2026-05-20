"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type DonutChartSimpleProps = {
  data: { name: string; value: number; color: string }[];
};

export default function DonutChartSimple({ data }: DonutChartSimpleProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius="60%"
          outerRadius="90%"
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          itemStyle={{ color: '#1e293b', fontWeight: 600 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
