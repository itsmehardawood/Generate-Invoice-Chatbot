'use client';

import { useState } from 'react';

const ProductSelection = ({ products, selectedProducts = [], onSelectionChange, isOffline = false }) => {
  const [selections, setSelections] = useState(selectedProducts);
  const [hasAttemptedProceed, setHasAttemptedProceed] = useState(false);

  const handleProductToggle = (productId) => {
    const newSelections = selections.includes(productId)
      ? selections.filter(id => id !== productId)
      : [...selections, productId];
    
    setSelections(newSelections);
    
    // Reset the error state when user makes a selection
    if (newSelections.length > 0 && hasAttemptedProceed) {
      setHasAttemptedProceed(false);
    }
  };

  const handleProceed = () => {
    if (selections.length === 0) {
      setHasAttemptedProceed(true);
      return;
    }
    
    onSelectionChange?.(selections);
  };

  const calculateTotal = () => {
    return products
      .filter(product => selections.includes(product.id))
      .reduce((total, product) => {
        // Handle both backend field names and frontend field names
        const price = product.totale || product.price || 0;
        const installation = product.installazione || product.installation || 0;
        return total + price + installation;
      }, 0);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Select Products for Invoice
        </h3>
        {isOffline && (
          <span className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
            Sample Data - Backend Offline
          </span>
        )}
      </div>
      
      {hasAttemptedProceed && selections.length === 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">
            ⚠️ Please select at least one product before proceeding.
          </p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Select
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Product
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Details
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Climate Zone
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Installation
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr 
                key={`product-${product.id}-${index}`} 
                className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selections.includes(product.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <td className="py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selections.includes(product.id)}
                    onChange={() => handleProductToggle(product.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {product.P_name || product.name}
                  </div>
                  {(product.P_code || product.code) && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Code: {product.P_code || product.code}
                    </div>
                  )}
                  {product.similarity_score && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Match: {(product.similarity_score * 100).toFixed(0)}%
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {product.description || 'No description available'}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {product.climate_zone && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      Zone {product.climate_zone}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    €{(product.totale || product.price || 0).toFixed(2)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    €{(product.installazione || product.installation || 0).toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selections.length} product{selections.length !== 1 ? 's' : ''} selected
            </span>
            {selections.length > 0 && (
              <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                Total: €{calculateTotal().toFixed(2)}
                <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                  (Including installation)
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleProceed}
            disabled={selections.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selections.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Create Invoice Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
