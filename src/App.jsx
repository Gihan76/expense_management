import { Grid2, Paper } from '@mui/material'
import { AddExpenseForm } from './components/expense/AddExpenseForm'
import { useEffect, useState } from 'react'
import { fetchConstants } from './services/expenseServices';
import { ExpensesTable } from './components/expense/ExpensesTable';

function App() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    (async() => {
      const data = await fetchConstants();
      setSettings(data);
    })();
  }, []);

  return (
    <>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        {/* form */}
        <Grid2 size={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <AddExpenseForm settings={settings} />
          </Paper>
        </Grid2>

        {/* table */}
        <Grid2 size={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <ExpensesTable />
          </Paper>
        </Grid2>
      </Grid2>
    </>
  );
}

export default App
