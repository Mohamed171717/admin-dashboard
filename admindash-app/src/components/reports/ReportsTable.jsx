import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "../../lib/utils";

const ReportsTable = ({ reports, onViewDetails }) => {
  return (
    <div className="w-full rounded-2xl border border-[#D8D2C2] shadow-sm overflow-hidden">
      <Table>
        {/* <TableCaption className="text-[#4A4947] font-medium">
          User Reports Overview
        </TableCaption> */}
        <TableHeader>
          <TableRow className="bg-[#FAF7F0]">
            <TableHead>Date</TableHead>
            <TableHead>From</TableHead>
            <TableHead>For</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className="hover:bg-[#FAF7F0]/40">
              <TableCell className="text-sm text-[#4A4947]">
                {formatDate(report.createdAt.toDate(), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="font-semibold text-[#4A4947]">
                {report.reporter}
              </TableCell>
              <TableCell className="font-semibold text-[#4A4947]">
                {report.reportedTo}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-[#D8D2C2] text-[#4A4947] px-3 py-1 rounded-full"
                >
                  {report.complainType}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={`px-3 py-1 rounded-full ${
                    report.resolved
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {report.resolved ? "Resolved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-[#FAF7F0] text-[#B17457] border-[#B17457] hover:bg-[#e9e4d7]"
                  onClick={() => onViewDetails(report)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;
