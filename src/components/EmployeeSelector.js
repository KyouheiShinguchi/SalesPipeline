import React from 'react';
import { employees } from '../mock-data';

export function EmployeeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">社員</span>
      <select
        value={value}
        onChange={(e) => {
          console.log('Selected Employee:', e.target.value); // デバッグログを追加
          onChange(e.target.value);
        }}
        className="border rounded px-2 py-1"
      >
        <option value="all">全員</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </div>
  );
}