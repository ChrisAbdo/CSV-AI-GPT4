import React, { useState, ChangeEvent } from "react";
import Papa from "papaparse";
import DataGrid, { Column } from "react-data-grid";

interface DataRow {
  [key: string]: string | number;
}

const CSVUploader: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<Column<DataRow>[]>([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const columns: Column<DataRow>[] = results.meta.fields.map(
          (field: string) => ({
            key: field,
            name: field,
            sortable: true,
          })
        );

        setData(results.data);
        setColumns(columns);
      },
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid columns={columns} rows={data} />
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
