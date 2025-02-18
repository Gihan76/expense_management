import { DataGrid, GridActionsCellItem, GridFooterContainer, GridPagination, GridToolbar } from "@mui/x-data-grid";
import React, { memo, useEffect, useState } from "react";
import { deleteExpense, fetchExpenses } from "../../services/expenseServices";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { getSettings, setExpenseEditFormData } from "../../redux/slicers.js/dataSlice";

export const ExpensesTable = memo(({ withinRange }) => {
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);
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
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
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
      flex: 1,
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
      width: 80,
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
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={(event) => {
            event.stopPropagation();
            const milliseconds = params.row?.date?.seconds * 1000 + params.row?.date?.nanoseconds / 1000000;
            const formattedDate = new Date(milliseconds);
            const clonedParamsRow = {...params.row};
            clonedParamsRow.date = formattedDate;
            dispatch(setExpenseEditFormData(clonedParamsRow));
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteRow(params.id);
          }}
        />,
      ],
    },
  ];

  const totalPrice = tableData.reduce((sum, row) => sum + Number(row.price), 0);
  const customFooter = () => (
    <GridFooterContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginLeft: "10px" }}>
            <span><strong>Total Expenses:</strong> Rs. {totalPrice.toFixed(2)}</span>
            <GridPagination />
        </div>
    </GridFooterContainer>
  );

  //   delete row functionality
  const handleDeleteRow = async (id) => {
    await deleteExpense(id);
  };

  // fetch real time table data
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

  //   fetch data if filter dates submit
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
    //   autoPageSize
      disableRowSelectionOnClick
      disableColumnFilter
      pageSizeOptions={[25, 50, 100, { value: -1, label: 'All' }]}
      slots={{
        footer: customFooter,
        toolbar: GridToolbar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  );
});
