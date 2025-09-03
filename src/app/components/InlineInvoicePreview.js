'use client';

import { useState } from 'react';

const InlineInvoicePreview = ({ invoiceData, onUpdate, onFinalize, isOffline = false }) => {
  // Initialize form data with proper building_site structure according to API spec
  const [formData, setFormData] = useState({
    recipient: invoiceData?.recipient || '',
    building_site: invoiceData?.building_site || {
      City: '',
      Country: '',
      Postal: ''
    },
    notes: invoiceData?.notes || ''
  });

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFinalize = () => {
    onFinalize?.(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-3 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 gap-3">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Invoice Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={handleFinalize}
            className="px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
          >
            Finalize Invoice
          </button>
        </div>
      </div>

      {/* Total Amount Highlight */}
      {invoiceData?.total && (
        <div className="mb-4 lg:mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                {invoiceData.draftId ? 'Draft Total' : 'Invoice Total'}
              </h3>
              {invoiceData.productCount && (
                <p className="text-sm text-green-600 dark:text-green-300">
                  {invoiceData.productCount} products selected
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                €{(invoiceData.total || 0).toFixed(2)}
              </div>
              {invoiceData.draftId && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  Draft ID: {invoiceData.draftId}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Products Summary */}
      <div className="mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3">Selected Products</h3>
        
        {/* Check if products exist and is an array */}
        {(!invoiceData?.products || !Array.isArray(invoiceData.products) || invoiceData.products.length === 0) ? (
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {invoiceData?.productCount ? 
              `${invoiceData.productCount} products selected (details not available in this view)` : 
              'No products available'
            }
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block lg:hidden space-y-3">
              {invoiceData.products.map((item, index) => (
                <div key={`preview-mobile-item-${item.product_id || index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                    {item.name || item.tipo}
                    {(item.description || item.descrizione_titolo) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">{item.description || item.descrizione_titolo}</div>
                    )}
                    {(item.climate_zone || item.zona_clim) && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-normal mt-1">Zone: {item.climate_zone || item.zona_clim}</div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                    <span className="text-gray-600 dark:text-gray-400">€{(item.unit_price || item.totale || 0).toFixed(2)}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{(item.total_price || (item.quantity * (item.unit_price || item.totale || 0)) || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Item</th>
                    <th className="text-center py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="text-right py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
                    <th className="text-right py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.products.map((item, index) => (
                    <tr key={`preview-item-${item.product_id || index}`} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 text-gray-900 dark:text-white">
                        <div className="font-medium text-sm lg:text-base">{item.name || item.tipo}</div>
                        {(item.description || item.descrizione_titolo) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.description || item.descrizione_titolo}</div>
                        )}
                        {(item.climate_zone || item.zona_clim) && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">Zone: {item.climate_zone || item.zona_clim}</div>
                        )}
                      </td>
                      <td className="py-2 text-center text-gray-900 dark:text-white text-sm lg:text-base">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-900 dark:text-white text-sm lg:text-base">€{(item.unit_price || item.totale || 0).toFixed(2)}</td>
                      <td className="py-2 text-right text-gray-900 dark:text-white text-sm lg:text-base">€{(item.total_price || (item.quantity * (item.unit_price || item.totale || 0)) || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
        
        {/* Totals Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">€{(invoiceData?.subtotal || invoiceData?.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax ({((invoiceData?.tax_rate || invoiceData?.taxRate || 0.085) * 100).toFixed(1)}%):</span>
                <span className="text-gray-900 dark:text-white">€{(invoiceData?.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">€{(invoiceData?.total_amount || invoiceData?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      {/* Customer Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipient Name *
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => handleInputChange('recipient', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Customer name"
              disabled={isOffline}
            />
          </div>
        </div>
      </div>

      {/* Building Site Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Installation Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.building_site.City || ''}
              onChange={(e) => handleInputChange('City', e.target.value, 'building_site')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="City"
              disabled={isOffline}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.building_site.Postal || ''}
              onChange={(e) => handleInputChange('Postal', e.target.value, 'building_site')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Postal code"
              disabled={isOffline}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.building_site.Country || ''}
              onChange={(e) => handleInputChange('Country', e.target.value, 'building_site')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Country"
              disabled={isOffline}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Additional notes or installation instructions..."
          disabled={isOffline}
        />
      </div>
    </div>
  );
};

export default InlineInvoicePreview;
