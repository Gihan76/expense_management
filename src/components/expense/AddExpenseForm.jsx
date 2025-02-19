import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { initialValues } from "./formik/initialValues";
import { expenseValidationSchema } from "./formik/validationSchema";
import { Autocomplete, Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CreateDropdownData } from "../../utils/common";
import { createExpense, updateExpense } from "../../services/expenseServices";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseFormData, getSettings, setExpenseFormData } from "../../redux/slicers.js/dataSlice";
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';

export const AddExpenseForm = () => {
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);
  const firebaseFormData = useSelector(getExpenseFormData);
  const { expenseCategories: categories, user, categoryTooltips } = settings;
  const expenseCategories = CreateDropdownData(Object.keys(settings).length ? categories : {});
  const users = CreateDropdownData(Object.keys(settings).length ? user : {});
  const [pageMode, setPageMode] = useState('add');
  const [disableFields, setDisableFields] = useState({
    date: false,
    name: false,
    category: false,
    quantity: false,
    price: false,
    expensedBy: false,
  });
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState(null);
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: expenseValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      if(pageMode === 'add'){
        await createExpense(values)
        .then((res) => {
          console.log("Expense added successfully -> ", res);
          resetForm();
        })
        .catch((err) => {
          console.error("Something went wrong while saving expense -> ", err);
        });
      }else if(pageMode === 'edit'){
        await updateExpense(firebaseFormData?.id, values)
          .then(() => {
            console.log("Expense updated successfully -> ", firebaseFormData?.id);
            dispatch(setExpenseFormData({})); // clear edit form data once success
            setPageMode('add'); // change back to add form
            resetForm(); // clear field data
          })
          .catch((err) => {
            console.error("Something went wrong while updating expense -> ", err);
          });
      }
    },
  });

  // edit page configurations
  useEffect(() => {
    if(Object.keys(firebaseFormData).length){
      if(firebaseFormData?.mode === "edit"){
        setPageMode('edit');
      }else if(firebaseFormData?.mode === "view"){
        setPageMode('view');
      }
      const { date, title, category, amount, price, createdBy } = firebaseFormData;
      formik.setValues((prevState) => ({
        ...prevState,
        date: date,
        name: title,
        category: category,
        amount: amount ? amount : "",
        price: price,
        by: createdBy,
      }))
    }
  }, [firebaseFormData]);

  useEffect(() => {
    if(pageMode === "view"){
      setDisableFields((prevState) => ({
        ...prevState,
        date: true,
        name: true,
        category: true,
        quantity: true,
        price: true,
        expensedBy: true,
      }));
    }else{
      if(pageMode === "add"){
        formik.resetForm();
      }
      setDisableFields((prevState) => ({
        ...prevState,
        date: false,
        name: false,
        category: false,
        quantity: false,
        price: false,
        expensedBy: false,
      }));
    }
  }, [pageMode]);

  // set category info values
  useEffect(() => {
    if(formik.values.category){
      const selectedCategory = expenseCategories.find((cat) => cat.value === formik.values.category);
      if(selectedCategory) setSelectedCategoryInfo(categoryTooltips[selectedCategory.value]);
    }else{
      setSelectedCategoryInfo(null);
    }
  }, [formik.values.category, expenseCategories, categoryTooltips]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Typography variant="h6" sx={{ mb: "15px", fontWeight: "bold" }}>
        {pageMode === "add" ? "Add" : pageMode === "edit" ? "Edit" : "View"}{" "}
        Expense
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Expense Date"
          value={formik.values.date}
          disabled={disableFields.date}
          onChange={(value) => formik.setFieldValue("date", value)}
          format="yyyy-MM-dd"
          minDate={new Date(2025, 0, 1)}
          maxDate={new Date()}
          slotProps={{
            field: {
              clearable: true,
            },
            textField: {
              fullWidth: true,
              helperText: formik.touched.date && formik.errors.date,
              error: formik.touched.date && Boolean(formik.errors.date),
            },
          }}
        />
      </LocalizationProvider>

      <TextField
        sx={{ mt: 1 }}
        fullWidth
        label="Name"
        name="name"
        disabled={disableFields.name}
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      <Autocomplete
        sx={{ mt: 1 }}
        fullWidth
        disabled={disableFields.category}
        options={expenseCategories}
        getOptionLabel={(option) => option.label}
        value={
          expenseCategories.find(
            (opt) => opt.value === formik.values.category
          ) || null
        }
        onChange={(_, value) =>
          formik.setFieldValue("category", value?.value ? value.value : "")
        }
        isOptionEqualToValue={(option, value) => {
          if (!value) return false;
          return option.value === value;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Category"
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          />
        )}
      />

      {selectedCategoryInfo && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "lightgray"
          }}
        >
          <Typography variant="body2" sx={{fontWeight: "bold"}}>{selectedCategoryInfo}</Typography>
        </div>
      )}

      <TextField
        sx={{ mt: 1 }}
        fullWidth
        label="Quantity"
        name="amount"
        disabled={disableFields.quantity}
        value={formik.values.amount}
        onChange={formik.handleChange}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
      />

      <TextField
        sx={{ mt: 1 }}
        fullWidth
        label="Price"
        name="price"
        type="number"
        disabled={disableFields.price}
        value={formik.values.price}
        onChange={formik.handleChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">Rs.</InputAdornment>
            ),
          },
        }}
        error={formik.touched.price && Boolean(formik.errors.price)}
        helperText={formik.touched.price && formik.errors.price}
      />

      <FormControl
        fullWidth
        sx={{ mt: 1 }}
        error={formik.touched.by && Boolean(formik.errors.by)}
      >
        <InputLabel id="expensed-by-select-label">Expensed By</InputLabel>
        <Select
          id="expensed-by-select"
          labelId="expensed-by-select-label"
          disabled={disableFields.expensedBy}
          value={formik.values.by}
          label="Expensed By"
          onChange={(e) => formik.setFieldValue("by", e.target.value)}
        >
          {users?.map((value, index) => (
            <MenuItem key={index} value={value?.value}>
              {value?.label}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.by && formik.errors.by && (
          <FormHelperText>{formik.errors.by}</FormHelperText>
        )}
      </FormControl>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {["add", "edit"].includes(pageMode) && (
          <Button
            startIcon={<SaveIcon />}
            type="submit"
            variant="contained"
            sx={{ mt: 2, textTransform: "none" }}
          >
            {pageMode === "add" ? "Add" : pageMode === "edit" ? "Update" : ""}{" "}
            Expense
          </Button>
        )}
        {pageMode === "view" && <div></div>}
        {["view", "edit"].includes(pageMode) && (
          <IconButton
            sx={{ mt: 2 }}
            title="Back to Add Expense"
            onClick={() => setPageMode("add")}
          >
            <ReplayIcon color="primary" />
          </IconButton>
        )}
      </div>
    </Box>
  );
};
