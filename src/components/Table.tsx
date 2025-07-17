import React, { useState } from 'react';
import '../styles/Table.css';
import Pagination from '../components/Pagination';


interface Column {
  key: string;
  header: string;
  render?: (value: any, row?: Record<string, any>, index?: number) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Paginate data
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      {/* <div className="table-container"> */}
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>No data found.</td>
            </tr>
          ) : (
            paginatedData.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  return (
                    <td key={col.key}>
                      {col.render 
                        ? col.render(cellValue, row, idx + ((page - 1) * rowsPerPage))
                        : typeof cellValue === 'number' 
                          ? cellValue.toString()
                          : cellValue}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
    {/* </div> */}
    <div>
        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
    </>
  );
};

export default Table;
