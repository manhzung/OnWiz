/**
 * Table component for admin dashboard
 */

import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  className = '',
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-md">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-md text-gray-600 text-base">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl overflow-hidden shadow-md border border-gray-200', className)}>
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="px-4 py-4 text-left font-semibold text-gray-900 text-sm uppercase tracking-wider border-b-2 border-gray-200"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="transition-all duration-250 hover:bg-gray-50 last:[&>td]:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-4 border-b border-gray-200 text-gray-600 text-[0.9375rem]"
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

