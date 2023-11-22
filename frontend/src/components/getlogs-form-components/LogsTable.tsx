import Table from "react-bootstrap/Table";
import "../../styles/LogsTable.css";

interface LogsTableProps {
  rows: string[][];
}

const tableHeaders: string[] = [
  "#",
  "Facility",
  "Severity",
  "Date",
  "Time",
  "Hostname",
  "Tag",
  "Content",
];

function LogsTable({ rows }: LogsTableProps) {
  return (
    <Table responsive bordered className="logs-table">
      <thead>
        <tr>
          {tableHeaders.map((header: string, index: number) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
        {rows.map((logs, rowIndex) => (
          <tr>
            <th>{rowIndex + 1}</th>
            {logs.map((columnValue, logIndex) => (
              <th key={logIndex}>{columnValue}</th>
            ))}
          </tr>
        ))}
      </thead>
    </Table>
  );
}

export default LogsTable;
