import React from 'react';

export const Table = ({
  headers = [],
  children,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-indigo-500/10 shadow-lg ${className}`}>
      <table className="w-full text-left border-collapse bg-slate-900/40 backdrop-blur-md">
        <thead>
          <tr className="border-b border-indigo-500/15 bg-brandIndigo/5 text-slate-400 font-semibold text-xs uppercase tracking-wider">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-500/5 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
