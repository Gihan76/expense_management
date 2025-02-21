import React from 'react'
import { Grid2, Paper } from '@mui/material'
import { AddExpenseForm } from './AddExpenseForm';
import { ExpensesTable } from './ExpensesTable';

export const Expenses = () => {
  return (
    <Grid2 container spacing={2} sx={{ padding: 2 }}>
      {/* form */}
      <Grid2 size={{ xs: 12, sm: 12, md: 4 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <AddExpenseForm />
        </Paper>
      </Grid2>

      {/* table */}
      <Grid2 size={{ xs: 12, sm: 12, md: 8 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <ExpensesTable />
        </Paper>
      </Grid2>
    </Grid2>
  );
};