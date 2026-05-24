export type TableColumn<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
};

export type DataTableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
};

export default function DataTable<T extends Record<string, string | number>>({
  columns,
  rows,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 ${
                  column.align === "right"
                    ? "text-right"
                    : column.align === "center"
                    ? "text-center"
                    : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={index} className="text-slate-700">
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-4 py-3 ${
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
