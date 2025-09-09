'use client';

import { useState, useEffect, useRef } from 'react';

const ProductSelection = ({ products, selectedProducts = [], onSelectionChange, isOffline = false }) => {
  const [selections, setSelections] = useState(selectedProducts);
  const [customQuantities, setCustomQuantities] = useState({});
  const [hasAttemptedProceed, setHasAttemptedProceed] = useState(false);
  const [processedProducts, setProcessedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsReload, setNeedsReload] = useState(false);
  const hasReloaded = useRef(false);

  // Check if data is incomplete and needs reload
  useEffect(() => {
    if (products && products.length > 0 && !hasReloaded.current) {
      const firstProduct = products[0];
      // Check if critical fields are missing
      if (
        firstProduct.quantity === undefined || 
        firstProduct.pagam_cliente === undefined || 
        firstProduct.quota_gse === undefined
      ) {
        setNeedsReload(true);
      }
    }
  }, [products]);

  // Set up auto-reload if needed
  useEffect(() => {
    if (needsReload && !hasReloaded.current) {
      const reloadTimer = setTimeout(() => {
        window.location.reload();
        hasReloaded.current = true;
      }, 1500); // 1.5 seconds delay

      return () => clearTimeout(reloadTimer);
    }
  }, [needsReload]);

  // Process products when they change
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('Processing products:', products);
      
      const processed = products.map(product => {
        // Get the actual quantity from the product
        const quantity = product.requested_quantity ?? product.quantity ?? 1;
        
        // Return the product with all necessary fields
        return {
          ...product,
          // Ensure all required fields are present
          quantity: quantity,
          requested_quantity: quantity,
          unit_price: product.unit_price ?? product.totale ?? product.price ?? 0,
          quota_gse: product.quota_gse || 0,
          pagam_cliente: product.pagam_cliente || 0,
          installaz: product.installaz || product.installation || 0
        };
      });
      
      setProcessedProducts(processed);
      
      // Initialize custom quantities with default product quantities
      const initialQuantities = {};
      processed.forEach(product => {
        initialQuantities[product.id] = product.quantity;
      });
      setCustomQuantities(initialQuantities);
      
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [products]);

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

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1); // Ensure minimum quantity is 1
    setCustomQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const getProductQuantity = (productId) => {
    return customQuantities[productId] || 1;
  };

  const handleProceed = () => {
    if (selections.length === 0) {
      setHasAttemptedProceed(true);
      return;
    }
    
    // Create the new format with product IDs and custom quantities
    const selectedProducts = selections.map(productId => ({
      product_id: productId,
      quantity: getProductQuantity(productId)
    }));
    
    onSelectionChange?.(selectedProducts);
  };

  const calculateTotal = () => {
    return processedProducts
      .filter(product => selections.includes(product.id))
      .reduce((total, product) => {
        const unitPrice = product.unit_price;
        const quantity = getProductQuantity(product.id);
        return total + (unitPrice * quantity);
      }, 0);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
        </div>
      </div>
    );
  }

  if (processedProducts.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No products available for selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 lg:p-6 border border-gray-200 dark:border-gray-700">
      {needsReload && !hasReloaded.current && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            ⏳ Loading complete product data...
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
          Select Products for Invoice
        </h3>
        {isOffline && (
          <span className="px-2 lg:px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
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
      
      {/* Mobile Card Layout */}
      <div className={`block lg:hidden space-y-3 ${processedProducts.length > 4 ? 'max-h-96 overflow-y-auto' : ''}`}>
        {processedProducts.map((product, index) => (
          <div 
            key={`product-mobile-${product.id}-${index}`}
            className={`border border-gray-200 dark:border-gray-700 rounded-lg p-3 transition-colors ${
              selections.includes(product.id) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selections.includes(product.id)}
                onChange={() => handleProductToggle(product.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {product.tipo || product.name}
                </div>
                {(product.P_code || product.code) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Code: {product.P_code || product.code}
                  </div>
                )}
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <span className="font-medium">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    value={getProductQuantity(product.id)}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {(product.descrizione_titolo || product.description) && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {product.descrizione_titolo || product.description}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      €{product.unit_price.toFixed(2)} each
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Total: €{(product.unit_price * getProductQuantity(product.id)).toFixed(2)}
                    </span>
                    {product.quota_gse > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        GSE: €{product.quota_gse.toFixed(2)}
                      </span>
                    )}
                    {product.pagam_cliente > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Client: €{product.pagam_cliente.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +€{product.installaz.toFixed(2)} install
                    </span>
                  </div>
                  <div className="text-right">
                    {(product.zona_clim || product.climate_zone) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        Zone {product.zona_clim || product.climate_zone}
                      </span>
                    )}
                    {product.similarity_score && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {(product.similarity_score * 100).toFixed(0)}% match
                      </div>
                    )}
                    {product.n_rate > 0 && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {product.n_rate}x €{(product.valore_rate || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className={`hidden lg:block overflow-x-auto ${processedProducts.length > 4 ? 'max-h-96 overflow-y-auto' : ''}`}>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Select
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Qty
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
                Unit Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                GSE Quota
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Payment
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Installation
              </th>
            </tr>
          </thead>
          <tbody>
            {processedProducts.map((product, index) => (
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
                <td className="py-3 px-2">
                  <input
                    type="number"
                    min="1"
                    value={getProductQuantity(product.id)}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {product.tipo || product.name}
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
                    {product.descrizione_titolo || product.description }
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {(product.zona_clim || product.climate_zone) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      Zone {product.zona_clim || product.climate_zone}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    €{product.unit_price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    per unit
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium text-blue-600 dark:text-blue-400">
                    €{(product.unit_price * getProductQuantity(product.id)).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    total for {getProductQuantity(product.id)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    €{product.quota_gse.toFixed(2)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    €{product.pagam_cliente.toFixed(2)}
                  </div>
                  {product.n_rate > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {product.n_rate}x €{(product.valore_rate || 0).toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    €{product.installaz.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 lg:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-center sm:text-left">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selections.length} product{selections.length !== 1 ? 's' : ''} selected
            </span>
            {selections.length > 0 && (
              <div className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mt-1">
                Total: €{calculateTotal().toFixed(2)}
                <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-normal">
                  (Including installation)
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleProceed}
            disabled={selections.length === 0}
            className={`px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base w-full sm:w-auto ${
              selections.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
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

