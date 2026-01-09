import React from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'

const Income = () => {
  useUser();
  return (
    <Dashboard>
      This is income page
    </Dashboard>
  )
}

export default Income