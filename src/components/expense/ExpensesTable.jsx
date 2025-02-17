import { DataGrid } from "@mui/x-data-grid";
import React, { memo, useEffect, useState } from "react";
import { fetchExpenses } from "../../services/expenseServices";

export const ExpensesTable = memo(({ settings, withinRange }) => {
  const { expenseCategories, user } = settings;
  const [tableData, setTableData] = useState([]);
  const columns = [
    {
      field: "date",
      headerName: "Date",
      align: "left",
      headerAlign: "left",
      valueFormatter: (value) => {
        const milliseconds = value.seconds * 1000;
        const date = new Date(milliseconds);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      },
    },
    {
      field: "title",
      headerName: "Expense",
      align: "left",
      headerAlign: "left",
      width: 200,
      flex: 1
    },
    {
      field: "category",
      headerName: "Type",
      align: "left",
      headerAlign: "left",
      width: 150,
      flex: 1,
      valueFormatter: (value) => {
        return expenseCategories?.[value];
      },
    },
    {
      field: "amount",
      headerName: "Quantity",
      align: "left",
      headerAlign: "left",
      width: 80
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      align: "left",
      headerAlign: "left",
      valueFormatter: (value) => {
        return `Rs. ${value}`;
      },
    },
    {
      field: "createdBy",
      headerName: "Expensed By",
      align: "left",
      headerAlign: "left",
      width: 110,
      valueFormatter: (value) => {
        return user?.[value];
      },
    },
  ];

  const totalPrice = tableData.reduce((sum, row) => sum + Number(row.price), 0);
  const customFooter = () => (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #ddd",
      }}
    >
      <strong>Total Expenses:</strong> Rs. {totalPrice.toFixed(2)}
    </div>
  );

  useEffect(() => {
    const unsubscribe = fetchExpenses((data) => {
        setTableData(data);
    }, {});
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (Object.keys(withinRange).length) {
      const unsubscribe = fetchExpenses((data) => {
        setTableData(data);
      }, withinRange);
      return () => {
        if (unsubscribe && typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    }
  }, [withinRange]);


  return (
    <DataGrid
      rows={tableData}
      columns={columns}
      slots={{
        footer: customFooter,
      }}
    />
  );
});
