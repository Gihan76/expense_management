import { Grid2, Paper } from '@mui/material'
import { AddExpenseForm } from './components/expense/AddExpenseForm'
import { useEffect } from 'react'
import { fetchConstants } from './services/expenseServices';
import { ExpensesTable } from './components/expense/ExpensesTable';
import { useDispatch } from 'react-redux';
import { setSettingsData } from './redux/slicers.js/dataSlice';

function App() {
  const dispatch = useDispatch();

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
            <ExpensesTable/>
          </Paper>
        </Grid2>
      </Grid2>
    </>
  );
}

export default App
