import { useFormik } from "formik";
import React from "react";
import { initialValues } from "./formik/initialValues";
import { expenseValidationSchema } from "./formik/validationSchema";
import { Autocomplete, Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CreateDropdownData } from "../../utils/common";
import { createExpense } from "../../services/expenseServices";

export const AddExpenseForm = ({ settings }) => {
  const { expenseCategories: categories, user, categoryTooltips } = settings;
  const expenseCategories = CreateDropdownData(Object.keys(settings).length ? categories : {});
  const users = CreateDropdownData(Object.keys(settings).length ? user : {});
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: expenseValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      await createExpense(values)
        .then((res) => {
          console.log("Expense added successfully -> ", res);
          resetForm();
        })
        .catch((err) => {
          console.error("Something went wrong -> ", err);
        })
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Typography variant="h6" gutterBottom sx={{ mb: "15px" }}>
        Add Expense
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Expense Date"
          value={formik.values.date}
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
        sx={{mt: 1}}
        fullWidth
        label="Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      <Autocomplete
        sx={{mt: 1}}
        fullWidth
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
        renderOption={(props, option) => (
          <Tooltip title={categoryTooltips[option.value]} placement="right" arrow>
            <li {...props}>
              {option.label}
            </li>
          </Tooltip>
        )}
      />

      <TextField
        sx={{mt: 1}}
        fullWidth
        label="Quantity"
        name="amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
      />

      <TextField
        sx={{mt: 1}}
        fullWidth
        label="Price (Rs.)"
        name="price"
        type="number"
        value={formik.values.price}
        onChange={formik.handleChange}
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

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Add Expense
      </Button>
    </Box>
  );
};
