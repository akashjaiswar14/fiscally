import React from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'

const Expense = () => {
  useUser();
  return (
    <Dashboard>
      This is expense page
    </Dashboard>
  )
}

export default Expense