import { Box, Button, Grid2, Paper } from '@mui/material'
import { AddExpenseForm } from './components/expense/AddExpenseForm'
import { useEffect, useState } from 'react'
import { fetchConstants } from './services/expenseServices';
import { ExpensesTable } from './components/expense/ExpensesTable';
import { useFormik } from 'formik';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { FIELD_MANDATORY, INVALID_DATE } from './config/constants';
import { useDispatch } from 'react-redux';
import { setSettingsData } from './redux/slicers.js/dataSlice';

function App() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const formik = useFormik({
    initialValues: {
      fromDate: null,
      toDate: null,
    },
    validationSchema: Yup.object({
      fromDate: Yup.date().typeError(INVALID_DATE).required(FIELD_MANDATORY),
      toDate: Yup.date().typeError(INVALID_DATE).required(FIELD_MANDATORY),
    }),
    onSubmit: async (values) => {
      setFormData(values);
    },
  });

  useEffect(() => {
    (async() => {
      const data = await fetchConstants();
      dispatch(setSettingsData(data));
    })();
  }, []);

  return (
    <>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        {/* form */}
        <Grid2 size={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <AddExpenseForm />
          </Paper>
        </Grid2>

        {/* table */}
        <Grid2 size={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <form onSubmit={formik.handleSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    marginBottom: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <DatePicker
                    label="From Date"
                    value={formik.values.fromDate}
                    onChange={(value) =>
                      formik.setFieldValue("fromDate", value)
                    }
                    format="yyyy-MM-dd"
                    minDate={new Date(2025, 0, 1)}
                    maxDate={new Date()}
                    slotProps={{
                      field: {
                        clearable: true,
                      },
                      textField: {
                        helperText:
                          formik.touched.fromDate && formik.errors.fromDate,
                        error:
                          formik.touched.fromDate &&
                          Boolean(formik.errors.fromDate),
                      },
                    }}
                  />
                  <DatePicker
                    label="To Date"
                    value={formik.values.toDate}
                    onChange={(value) => formik.setFieldValue("toDate", value)}
                    format="yyyy-MM-dd"
                    minDate={new Date(2025, 0, 1)}
                    maxDate={new Date()}
                    slotProps={{
                      field: {
                        clearable: true,
                      },
                      textField: {
                        helperText:
                          formik.touched.toDate && formik.errors.toDate,
                        error:
                          formik.touched.toDate &&
                          Boolean(formik.errors.toDate),
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: "10px" }}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </LocalizationProvider>

            <ExpensesTable withinRange={formData} />
          </Paper>
        </Grid2>
      </Grid2>
    </>
  );
}

export default App
