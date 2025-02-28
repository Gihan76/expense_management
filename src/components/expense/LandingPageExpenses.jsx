import React from 'react'
import { EXPENSE_PAGE_ACTIONS } from '../../config/constants'
import ProductCard from '../common/ProductCard'

const LandingPageExpenses = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {EXPENSE_PAGE_ACTIONS.map((product, index) => (
        <ProductCard
          key={index}
          icon={product.logo}
          link={product.navigateTo}
          title={product.title}
        />
      ))}
    </div>
  )
}

export default LandingPageExpenses