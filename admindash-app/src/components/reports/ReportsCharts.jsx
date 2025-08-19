import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useMemo } from "react";

// palette
const C = {
  bg: "#FAF7F0",
  border: "#D8D2C2",
  text: "#4A4947",
  accent: "#B17457",
  green: "#16a34a",
  yellow: "#f59e0b",
};

function toDate(val) {
  if (!val) return null;
  if (typeof val?.toDate === "function") return val.toDate();
  return new Date(val);
}

function lastNDays(n) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
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

export default function ReportCharts({ reports = [] }) {
  const { dailyTrend, typeData, statusData, total } = useMemo(() => {
    const total = reports.length;

    // Daily trend (last 14 days)
    const days = lastNDays(14);
    const countsByDay = Object.fromEntries(days.map((d) => [d.key, 0]));
    reports.forEach((r) => {
      const d = toDate(r.createdAt);
      if (!d || Number.isNaN(+d)) return;
      const key = d.toISOString().slice(0, 10);
      if (key in countsByDay) countsByDay[key] += 1;
    });
    const dailyTrend = days.map((d) => ({
      date: d.label,
      count: countsByDay[d.key],
    }));

    // By type
    const typeMap = {};
    reports.forEach((r) => {
      const t = r.complainType || "unknown";
      typeMap[t] = (typeMap[t] || 0) + 1;
    });
    const typeData = Object.entries(typeMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Status
    const resolved = reports.filter((r) => r.resolved).length;
    const pending = total - resolved;
    const statusData = [
      { name: "Resolved", value: resolved, color: C.green },
      { name: "Pending", value: pending, color: C.yellow },
    ];

    return { dailyTrend, typeData, statusData, total };
  }, [reports]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      {/* Trend */}
      <Card className="bg-[#FAF7F0] border-[#D8D2C2] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A4947]">
            Reports Trend (Last 14 days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {total === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#4A4947]/70">
              No reports yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyTrend}
                margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid stroke="#E8E2D6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
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
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={C.accent}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* By Type */}
      <Card className="bg-[#FAF7F0] border-[#D8D2C2] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A4947]">Reports by Type</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {typeData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#4A4947]/70">
              No data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={typeData}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#E8E2D6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: C.text }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
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
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Count"
                  fill={C.accent}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="bg-[#FAF7F0] border-[#D8D2C2] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A4947]">Status</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {total === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#4A4947]/70">
              No data.
            </div>
          ) : (
            <div className="flex h-full items-center">
              <div className="w-1/2 h-56">
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
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {statusData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {statusData.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-[#4A4947]">{s.name}</span>
                    <span className="text-sm font-semibold text-[#4A4947]">
                      {s.value}
                    </span>
                  </div>
                ))}
                <div className="mt-2 h-2 w-full bg-[#D8D2C2] rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${
                        ((statusData[0]?.value || 0) / (total || 1)) * 100
                      }%`,
                      background: C.green,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
