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
import { toast } from "react-toastify";

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
    submitBtn: false,
  });
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState(null);
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: expenseValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      const toastId = toast.loading("Processing...");
      try {
        setDisableFields((prevState) => ({ ...prevState, submitBtn: true }));
        if (pageMode === "add") {
          await createExpense(values);
          toast.update(toastId, {
            render: "Expense saved successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          resetForm();
          setDisableFields((prevState) => ({ ...prevState, submitBtn: false }));
        } else if (pageMode === "edit") {
          await updateExpense(firebaseFormData?.id, values);
          toast.update(toastId, {
            render: "Expense updated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          dispatch(setExpenseFormData({}));
          setPageMode("add");
          resetForm();
          setDisableFields((prevState) => ({ ...prevState, submitBtn: false }));
        }
      } catch (err) {
        toast.update(toastId, {
          render: "Something went wrong, Please Try again!",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error("Something went wrong while saving/updating expense -> ",err);
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
      const { date, title, category, notes, price, createdBy, modifiedBy } = firebaseFormData;
      formik.setValues((prevState) => ({
        ...prevState,
        date: date,
        name: title,
        category: category,
        notes: notes ? notes : "",
        price: price,
        by: modifiedBy ? modifiedBy : createdBy,
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
        formik.resetForm(); // reset page data when user clicks reset button in the form
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
        multiline
        maxRows={3}
        label="Notes"
        name="notes"
        disabled={disableFields.quantity}
        value={formik.values.notes}
        onChange={formik.handleChange}
        error={formik.touched.notes && Boolean(formik.errors.notes)}
        helperText={formik.touched.notes && formik.errors.notes}
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
            disabled={disableFields.submitBtn}
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
