import {
  DataGrid,
  GridActionsCellItem,
  GridFooterContainer,
  GridPagination,
  GridToolbar,
} from "@mui/x-data-grid";
import React, { memo, useEffect, useMemo, useState } from "react";
import { deleteExpense, fetchExpenses } from "../../services/expenseServices";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import {
  getSettings,
  setExpenseFormData,
} from "../../redux/slicers.js/dataSlice";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { CUSTOMER_FILTER_OPTIONS } from "../../config/constants";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

export const ExpensesTable = memo(() => {
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);
  const { expenseCategories, user } = settings;
  const [tableData, setTableData] = useState([]);
  const [sortByColumn, setSortByColumn] = useState([
    { field: "date", sort: "desc" },
  ]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  })
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

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
      width: 110,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon color="info" />}
          label="View"
          title="View"
          onClick={(event) => {
            event.stopPropagation();
            const milliseconds =
              params.row?.date?.seconds * 1000 +
              params.row?.date?.nanoseconds / 1000000;
            const formattedDate = new Date(milliseconds);
            const clonedParamsRow = { ...params.row };
            clonedParamsRow.date = formattedDate;
            clonedParamsRow.mode = "view";
            dispatch(setExpenseFormData(clonedParamsRow));
          }}
        />,
        <GridActionsCellItem
          icon={<EditIcon color="warning" />}
          label="Edit"
          title="Edit"
          onClick={(event) => {
            event.stopPropagation();
            const milliseconds =
              params.row?.date?.seconds * 1000 +
              params.row?.date?.nanoseconds / 1000000;
            const formattedDate = new Date(milliseconds);
            const clonedParamsRow = { ...params.row };
            clonedParamsRow.date = formattedDate;
            clonedParamsRow.mode = "edit";
            dispatch(setExpenseFormData(clonedParamsRow));
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          title="Delete"
          onClick={(event) => {
            event.stopPropagation();
            handleDeletePopUpOpen(params.id);
          }}
        />,
      ],
    },
  ];

  // change sort by in the data grid
  const handleSortByColumnChange = (newSortByColumn) => {
    setSortByColumn(newSortByColumn);
  };

  // filter data based on the selection (last week, month, year)
  const filteredData = useMemo(() => {
    if (selectedFilter === "all") {
      return tableData;
    }
    const now = dayjs();
    let filterStart;
    switch (selectedFilter) {
      case "week":
        filterStart = now.startOf("week");
        break;
      case "month":
        filterStart = now.startOf("month");
        break;
      case "year":
        filterStart = now.startOf("year");
        break;
      default:
        return tableData;
    }
    return tableData.filter((row) => {
      const milliseconds =
        row.date.seconds * 1000 + (row.date.nanoseconds / 1000000 || 0);
      const rowDate = dayjs(milliseconds);
      return rowDate.isSameOrAfter(filterStart, "day");
    });
  }, [tableData, selectedFilter]);

  //  const totalPrice = tableData.reduce((sum, row) => sum + Number(row.price), 0);
  const totalPrice = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + Number(row.price), 0);
  }, [filteredData]);
  
  const customFooter = () => (
    <GridFooterContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginLeft: "10px",
        }}
      >
        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem" , whiteSpace: "nowrap"}}>
          Total Expenses:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            Rs. {totalPrice.toFixed(2)}
          </span>
        </Typography>
        <GridPagination />
      </div>
    </GridFooterContainer>
  );

  const handleDeletePopUpOpen = (rowId) => {
    setRowToDelete(rowId);
    setIsDeletePopUpOpen(true);
  };

  const handleDeletePopUpClose = () => {
    setRowToDelete(null);
    setIsDeletePopUpOpen(false);
  };

  //   delete row functionality
  const handleDeleteRow = async (id) => {
    await deleteExpense(id);
    handleDeletePopUpClose();
  };

  // fetch real time table data
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = fetchExpenses((data) => {
      setTableData(data);
      setIsLoading(false);
    }, {});
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Expenses
        </Typography>

        <FormControl size="small" sx={{width: "150px"}}>
          <InputLabel id="filter-label">Filter By</InputLabel>
          <Select
            labelId="filter-label"
            id="filter"
            value={selectedFilter}
            label="Filter By"
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {CUSTOMER_FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataGrid
        rows={filteredData}
        columns={columns}
        loading={isLoading}
        disableColumnFilter
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100, { value: -1, label: "All" }]}
        sortModel={sortByColumn}
        onSortModelChange={handleSortByColumnChange}
        slots={{
          footer: customFooter, // custom total footer
          toolbar: GridToolbar, // default toolbar at the top of table
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true, // search bar
          },
          loadingOverlay: {
            // circular loader until records get loaded
            variant: "circular-progress",
            noRowsVariant: "circular-progress",
          },
        }}
      />

      {/* delete row pop up */}
      <Dialog open={isDeletePopUpOpen} onClose={handleDeletePopUpClose}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeletePopUpClose} variant="contained">
            No
          </Button>
          <Button
            onClick={() => handleDeleteRow(rowToDelete)}
            variant="outlined"
            color="error"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});