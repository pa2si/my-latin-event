"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    events: number;
    likes: number;
    follows: number;
  }[];
  type: "events" | "engagement";
  colors: string[];
}

const Chart = ({ data, type, colors }: ChartProps) => {
  // Get all values to find the max for YAxis domain
  const allValues = data.reduce((acc, item) => {
    if (type === "events") {
      acc.push(item.events);
    } else {
      acc.push(item.likes, item.follows);
    }
    return acc;
  }, [] as number[]);

  const maxValue = Math.max(...allValues);
  const yAxisDomain = [0, Math.ceil(maxValue * 1.1)]; // Add 10% padding

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={yAxisDomain}
          allowDecimals={false}
        />
        <Tooltip />
        {type === "events" ? (
          <Area
            type="monotone"
            dataKey="events"
            stroke={colors[0]}
            fill={colors[0]}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ) : (
          <>
            <Area
              type="monotone"
              dataKey="likes"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.2}
              strokeWidth={2}
              name="Likes"
            />
            <Area
              type="monotone"
              dataKey="follows"
              stroke={colors[1]}
              fill={colors[1]}
              fillOpacity={0.2}
              strokeWidth={2}
              name="Follows"
            />
          </>
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
