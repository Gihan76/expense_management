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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { getSettings } from "../../redux/slicers.js/dataSlice";
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
  Paper,
  Select,
  Typography,
} from "@mui/material";
import {
  CUSTOMER_FILTER_OPTIONS,
  LIST_EXPENSES_PATH,
} from "../../config/constants";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { encodedSlug } from "../../utils/common";
dayjs.extend(isSameOrAfter);

export const ExpensesTable = memo(() => {
  const navigate = useNavigate();
  const settings = useSelector(getSettings);
  const { expenseCategories, user } = settings;
  const [tableData, setTableData] = useState([]);
  const [sortByColumn, setSortByColumn] = useState([
    { field: "date", sort: "desc" },
  ]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const columns = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      align: "left",
      headerAlign: "left",
      flex: 1,
      minWidth: 110,
      valueFormatter: (value) => {
        if (value) {
          return dayjs(value).format("YYYY-MM-DD");
        }
        return "";
      },
    },
    {
      field: "title",
      headerName: "Expense",
      align: "left",
      headerAlign: "left",
      flex: 2,
      minWidth: 130,
    },
    {
      field: "category",
      headerName: "Type",
      align: "left",
      headerAlign: "left",
      flex: 1,
      minWidth: 110,
      valueFormatter: (value) => {
        return expenseCategories?.[value];
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      filterable: false,
      align: "left",
      headerAlign: "left",
      flex: 3,
      minWidth: 120,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      align: "left",
      headerAlign: "left",
      flex: 1,
      minWidth: 110,
      valueFormatter: (value) => {
        return `Rs. ${value}`;
      },
    },
    {
      field: "createdBy",
      headerName: "Expensed By",
      align: "left",
      headerAlign: "left",
      flex: 1,
      minWidth: 160,
      valueFormatter: (value, rowData) => {
        // if modifiedBy value available show it, otherwise show createdBy
        if (rowData?.modifiedBy && user?.[rowData?.modifiedBy]) {
          return user?.[rowData?.modifiedBy];
        } else {
          return user?.[value];
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      minWidth: 110,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon color="info" />}
          label="View"
          title="View"
          onClick={(event) => {
            event.stopPropagation();
            const encodedId = encodedSlug(params.id);
            navigate(`${LIST_EXPENSES_PATH}/view/${encodedId}`);
          }}
        />,
        <GridActionsCellItem
          icon={<EditIcon color="warning" />}
          label="Edit"
          title="Edit"
          onClick={(event) => {
            event.stopPropagation();
            const encodedId = encodedSlug(params.id);
            navigate(`${LIST_EXPENSES_PATH}/edit/${encodedId}`);
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
    const now = new Date();
    let filterStart;
    switch (selectedFilter) {
      case "week":
        filterStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 6
        );
        break;
      case "month":
        let previousMonth = now.getMonth() - 1;
        let previousYear = now.getFullYear();
        if (previousMonth < 0) {
          previousMonth = 11;
          previousYear--;
        }
        filterStart = new Date(previousYear, previousMonth, now.getDate());
        break;
      case "year":
        filterStart = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        break;
      default:
        return tableData;
    }
    return tableData.filter((row) => {
      if (!row?.date) {
        return false;
      }
      const rowDate = new Date(row.date);
      const rowDateOnly = new Date(
        rowDate.getFullYear(),
        rowDate.getMonth(),
        rowDate.getDate()
      );
      const filterStartOnly = new Date(
        filterStart.getFullYear(),
        filterStart.getMonth(),
        filterStart.getDate()
      );
      return rowDateOnly >= filterStartOnly;
    });
  }, [tableData, selectedFilter]);

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
        <Typography
          sx={{ fontWeight: 400, fontSize: "0.875rem", whiteSpace: "nowrap" }}
        >
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
    const toastId = toast.loading("Processing...");
    await deleteExpense(id);
    toast.update(toastId, {
      render: "Expense deleted successfully!",
      type: "success",
      isLoading: false,
      autoClose: 5000,
    });
    handleDeletePopUpClose();
  };

  // fetch real time table data
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = fetchExpenses((data) => {
      const formattedResponse = data?.map((d) => ({
        ...d,
        date: d?.date?.toDate(),
      }));
      setTableData(formattedResponse);
      setIsLoading(false);
    }, {});
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <div style={{ height: "100%", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mr: 1 }}>
              Expenses
            </Typography>
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<AddCircleIcon />}
              style={{ marginLeft: "10px", textTransform: "none" }}
              onClick={() => navigate(`${LIST_EXPENSES_PATH}/create`)}
            >
              Create
            </Button>
          </Box>

          <FormControl size="small" sx={{ width: "150px" }}>
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
          initialState={{
            density: "compact",
          }}
          rows={filteredData}
          columns={columns}
          loading={isLoading}
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
    </Paper>
  );
});
