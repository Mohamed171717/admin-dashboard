import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#B17457", "#4A4947"];

export default function UserRoleChart({ users }) {
  const readers = users.filter((u) => u.role === "reader").length;
  const libraries = users.filter((u) => u.role === "library").length;

  const data = [
    { name: "Readers", value: readers },
    { name: "Libraries", value: libraries },
  ];

  return (
    <div className="w-full h-80 bg-[#FAF7F0] rounded-2xl p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-[#4A4947] mb-4">
        User Roles Distribution
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#D8D2C2"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FAF7F0",
              borderRadius: "12px",
              border: "1px solid #D8D2C2",
              color: "#4A4947",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: "#4A4947", fontSize: "14px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
