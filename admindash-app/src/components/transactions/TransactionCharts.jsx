"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --- palette (your colors)
const C = {
  bg: "#FAF7F0",
  border: "#D8D2C2",
  text: "#4A4947",
  accent: "#B17457",
  green: "#16a34a",
  red: "#dc2626",
  yellow: "#f59e0b",
  slate: "#64748b",
};

function toDate(v) {
  if (!v) return null;
  if (typeof v?.toDate === "function") return v.toDate();
  return new Date(v);
}

function lastNDays(n) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({
      key,
      label: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    });
  }
  return out;
}

function getAmount(t) {
  const n = t?.total ?? t?.totalPrice ?? t?.amount ?? t?.price ?? 0;
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

export default function TransactionCharts({ transactions = [] }) {
  const { daily, byMethod, byStatus, topGovs, totalCount } = useMemo(() => {
    const totalCount = transactions.length;

    // --- Daily trend (last 14 days): count + revenue
    const days = lastNDays(14);
    const seed = Object.fromEntries(
      days.map((d) => [d.key, { count: 0, revenue: 0 }])
    );

    transactions.forEach((t) => {
      const d = toDate(t?.createdAt);
      if (!d || Number.isNaN(+d)) return;
      const key = d.toISOString().slice(0, 10);
      if (seed[key]) {
        seed[key].count += 1;
        seed[key].revenue += getAmount(t);
      }
    });

    const daily = days.map((d) => ({
      date: d.label,
      count: seed[d.key].count,
      revenue: Number(seed[d.key].revenue.toFixed(2)),
    }));

    // --- Payment method breakdown
    const pmMap = {};
    transactions.forEach((t) => {
      const method = t?.paymentMethod ?? t?.method ?? t?.provider ?? "unknown";
      pmMap[method] = (pmMap[method] || 0) + 1;
    });
    const byMethod = Object.entries(pmMap).map(([name, value]) => ({
      name,
      value,
    }));

    // --- Status breakdown
    const stMap = {};
    transactions.forEach((t) => {
      const s = (t?.status || "unknown").toString();
      stMap[s] = (stMap[s] || 0) + 1;
    });
    const byStatus = Object.entries(stMap).map(([name, value]) => ({
      name,
      value,
    }));
    const govMap = {};
    transactions.forEach((t) => {
      const gov = (t?.buyerInfo?.government || "Unknown").toString();
      govMap[gov] = (govMap[gov] || 0) + 1;
    });
    const govEntries = Object.entries(govMap).map(([name, value]) => ({
      name,
      value,
    }));
    govEntries.sort((a, b) => b.value - a.value);

    const topThree = govEntries.slice(0, 3);
    const othersValue = govEntries
      .slice(3)
      .reduce((sum, g) => sum + g.value, 0);
    const topGovs =
      othersValue > 0
        ? [...topThree, { name: "Others", value: othersValue }]
        : topThree;

    return { daily, byMethod, byStatus, topGovs, totalCount };
  }, [transactions]);

  // pick status colors consistently
  const statusColor = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("paid") || n.includes("complete")) return C.green;
    if (n.includes("pending") || n.includes("processing")) return C.yellow;
    if (n.includes("fail") || n.includes("cancel") || n.includes("refund"))
      return C.red;
    if (n.includes("unknown")) return C.slate;
    return C.accent;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      {/* Trend */}
      <Card className="bg-[#FAF7F0] border-[#D8D2C2] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A4947]">
            Transactions Trend (Last 14 days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {totalCount === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#4A4947]/70">
              No transactions yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={daily}
                margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#E8E2D6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  allowDecimals={false}
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: C.text }}
                  formatter={(val, name) => [
                    name === "revenue" ? `${val}` : val,
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  name="Orders"
                  stroke={C.accent}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={C.green}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Buyer Regions (Governorates) */}
      <Card className="bg-[#FAF7F0] border-[#D8D2C2] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A4947]">Top Buyer Regions</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {topGovs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#4A4947]/70">
              No data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topGovs}
                layout="vertical"
                margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#E8E2D6"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: C.text }}
                  formatter={(val) => [val, "Orders"]}
                />
                <Bar
                  dataKey="value"
                  name="Orders"
                  fill={C.accent}
                  radius={[8, 8, 8, 8]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="bg-[#FAF7F0] border-[#D8D2C2] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A4947]">Order Status</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {byStatus.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#4A4947]/70">
              No data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: C.text }}
                />
                <Legend />
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {byStatus.map((s, i) => (
                    <Cell key={i} fill={statusColor(s.name)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
