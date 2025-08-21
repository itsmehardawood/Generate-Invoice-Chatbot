'use client';

import { useState } from 'react';
import ProductSelection from './ProductSelection';
import InvoiceCard from './InvoiceCard';

// Inline InvoicePreview component to avoid import issues
const InlineInvoicePreview = ({ invoiceData, onUpdate, onFinalize, isOffline = false }) => {
  const [formData, setFormData] = useState({
    recipient: invoiceData?.recipient || '',
    building_site: invoiceData?.building_site || {
      address: '',
      city: '',
      postal_code: '',
      country: ''
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
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate?.(formData)}
            disabled={isOffline}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              isOffline 
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Save Changes
          </button>
          <button
            onClick={handleFinalize}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Finalize Invoice
          </button>
        </div>
      </div>

      {/* Selected Products Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Selected Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Item</th>
                <th className="text-center py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody>
              {(invoiceData?.products || []).map((item, index) => (
                <tr key={`preview-item-${item.product_id || index}`} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-900 dark:text-white">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    )}
                    {item.climate_zone && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">Zone: {item.climate_zone}</div>
                    )}
                  </td>
                  <td className="py-2 text-center text-gray-900 dark:text-white">{item.quantity}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">€{(item.unit_price || 0).toFixed(2)}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">€{(item.total_price || (item.quantity * item.unit_price) || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Totals Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">€{(invoiceData?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax ({((invoiceData?.tax_rate || 0.22) * 100).toFixed(1)}%):</span>
                <span className="text-gray-900 dark:text-white">€{(invoiceData?.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">€{(invoiceData?.total_amount || 0).toFixed(2)}</span>
              </div>
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
              Address
            </label>
            <input
              type="text"
              value={formData.building_site.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value, 'building_site')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Street address"
              disabled={isOffline}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.building_site.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value, 'building_site')}
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
              value={formData.building_site.postal_code || ''}
              onChange={(e) => handleInputChange('postal_code', e.target.value, 'building_site')}
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
              value={formData.building_site.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value, 'building_site')}
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

// Professional Invoice Display Component
const ProfessionalInvoice = ({ invoiceData, invoiceId, isOffline = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const data = invoiceData.data || invoiceData;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Invoice Paper Effect */}
      <div className="bg-white p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">GreenGen Energy Solutions</p>
              <p>123 Business Street</p>
              <p>Business City, State 12345</p>
              <p>Email: contact@greengen.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Invoice #:</span> INV-{invoiceId}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(invoiceData.created_at)}</p>
              <p><span className="font-semibold">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">{invoiceData.status?.toUpperCase()}</span></p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-base">{data.recipient}</p>
              {data.building_site?.address && <p>{data.building_site.address}</p>}
              {data.building_site?.city && <p>{data.building_site.city}</p>}
              {data.building_site?.postal_code && <p>{data.building_site.postal_code}</p>}
              {data.building_site?.country && <p>{data.building_site.country}</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation Address:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {data.building_site?.address && <p>{data.building_site.address}</p>}
              {data.building_site?.city && <p>{data.building_site.city}</p>}
              {data.building_site?.postal_code && <p>{data.building_site.postal_code}</p>}
              {data.building_site?.country && <p>{data.building_site.country}</p>}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Unit Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.products?.map((item, index) => (
                <tr key={`final-invoice-item-${item.product_id || index}`} className="border-b border-gray-200">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    )}
                    {item.climate_zone && (
                      <div className="text-xs text-blue-600 mt-1">Climate Zone: {item.climate_zone}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-900">€{(item.unit_price || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-900 font-medium">€{(item.total_price || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-900 font-medium">€{(data.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Tax ({((data.tax_rate || 0) * 100).toFixed(1)}%):</span>
                <span className="text-gray-900 font-medium">€{(data.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-lg font-bold text-gray-900">€{(data.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {data.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{data.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Thank you for your business!</p>
            <p>For questions about this invoice, please contact us at contact@greengen.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Invoice
          </button>
          <button
            onClick={() => {
              // Create download link for invoice data
              const element = document.createElement('a');
              const file = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
              element.href = URL.createObjectURL(file);
              element.download = `invoice-${invoiceId}.json`;
              element.click();
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

// Professional Invoice Display Component with Change Highlighting
const ProfessionalInvoiceWithChanges = ({ invoiceData, originalInvoiceData, invoiceId, isOffline = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const data = invoiceData.data || invoiceData;
  const originalData = originalInvoiceData?.data || originalInvoiceData || {};

  // Helper function to check if a value has changed
  const hasChanged = (newVal, oldVal) => {
    return JSON.stringify(newVal) !== JSON.stringify(oldVal);
  };

  // Helper function to render highlighted text if changed
  const renderWithHighlight = (newVal, oldVal, className = "") => {
    const changed = hasChanged(newVal, oldVal);
    return (
      <span className={`${className} ${changed ? 'bg-yellow-200 px-1 rounded' : ''}`}>
        {newVal}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Invoice Paper Effect */}
      <div className="bg-white p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">
                {renderWithHighlight(data.sender || 'GreenGen Energy Solutions', originalData.sender, 'font-semibold')}
              </p>
              <p>123 Business Street</p>
              <p>Business City, State 12345</p>
              <p>Email: contact@greengen.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Invoice #:</span> INV-{invoiceId}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(invoiceData.created_at)}</p>
              <p><span className="font-semibold">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">{invoiceData.status?.toUpperCase()}</span></p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-base">
                {renderWithHighlight(data.recipient, originalData.recipient, 'font-semibold text-base')}
              </p>
              {data.building_site?.address && (
                <p>{renderWithHighlight(data.building_site.address, originalData.building_site?.address)}</p>
              )}
              {data.building_site?.city && (
                <p>{renderWithHighlight(data.building_site.city, originalData.building_site?.city)}</p>
              )}
              {data.building_site?.postal_code && (
                <p>{renderWithHighlight(data.building_site.postal_code, originalData.building_site?.postal_code)}</p>
              )}
              {data.building_site?.country && (
                <p>{renderWithHighlight(data.building_site.country, originalData.building_site?.country)}</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation Address:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {data.building_site?.address && (
                <p>{renderWithHighlight(data.building_site.address, originalData.building_site?.address)}</p>
              )}
              {data.building_site?.city && (
                <p>{renderWithHighlight(data.building_site.city, originalData.building_site?.city)}</p>
              )}
              {data.building_site?.postal_code && (
                <p>{renderWithHighlight(data.building_site.postal_code, originalData.building_site?.postal_code)}</p>
              )}
              {data.building_site?.country && (
                <p>{renderWithHighlight(data.building_site.country, originalData.building_site?.country)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Unit Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.products?.map((item, index) => {
                const originalItem = originalData.products?.[index] || {};
                return (
                  <tr key={`edited-invoice-item-${item.product_id || index}`} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {renderWithHighlight(item.name, originalItem.name, 'font-medium text-gray-900')}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {renderWithHighlight(item.description, originalItem.description, 'text-sm text-gray-600 mt-1')}
                        </div>
                      )}
                      {item.climate_zone && (
                        <div className="text-xs text-blue-600 mt-1">
                          Climate Zone: {renderWithHighlight(item.climate_zone, originalItem.climate_zone, 'text-xs text-blue-600')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-900">
                      {renderWithHighlight(item.quantity, originalItem.quantity, 'text-center text-gray-900')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      €{renderWithHighlight((item.unit_price || 0).toFixed(2), (originalItem.unit_price || 0).toFixed(2), 'text-right text-gray-900')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">
                      €{renderWithHighlight((item.total_price || 0).toFixed(2), (originalItem.total_price || 0).toFixed(2), 'text-right text-gray-900 font-medium')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-900 font-medium">
                  €{renderWithHighlight((data.subtotal || 0).toFixed(2), (originalData.subtotal || 0).toFixed(2), 'text-gray-900 font-medium')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">
                  Tax ({renderWithHighlight(((data.tax_rate || 0) * 100).toFixed(1), ((originalData.tax_rate || 0) * 100).toFixed(1))}%):
                </span>
                <span className="text-gray-900 font-medium">
                  €{renderWithHighlight((data.tax_amount || 0).toFixed(2), (originalData.tax_amount || 0).toFixed(2), 'text-gray-900 font-medium')}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-lg font-bold text-gray-900">
                  €{renderWithHighlight((data.total_amount || 0).toFixed(2), (originalData.total_amount || 0).toFixed(2), 'text-lg font-bold text-gray-900')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {data.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {renderWithHighlight(data.notes, originalData.notes, 'text-gray-700')}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Thank you for your business!</p>
            <p>For questions about this invoice, please contact us at contact@greengen.com</p>
            {/* Changes indicator */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                🎯 <span className="bg-yellow-200 px-2 py-1 rounded">Changes highlighted in yellow</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Invoice
          </button>
          <button
            onClick={() => {
              // Create download link for invoice data
              const element = document.createElement('a');
              const file = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
              element.href = URL.createObjectURL(file);
              element.download = `invoice-${invoiceId}-edited.json`;
              element.click();
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, onProductSelect, onInvoiceUpdate, onInvoiceFinalize }) => {
  const renderSpecialContent = () => {
    try {
      if (message.type === 'product-selection') {
        if (!ProductSelection) {
          console.error('ProductSelection component is undefined');
          return <div>Error: ProductSelection component not loaded</div>;
        }
        return (
          <ProductSelection
            products={message.products}
            selectedProducts={message.selectedProducts}
            onSelectionChange={(selectedProducts) => onProductSelect(selectedProducts, message.queryId)}
            isOffline={message.isOffline}
          />
        );
      }
      
      if (message.type === 'invoice-preview') {
        return (
          <InlineInvoicePreview
            invoiceData={message.invoiceData}
            onUpdate={onInvoiceUpdate}
            onFinalize={(invoiceData) => onInvoiceFinalize(invoiceData, message.draftId)}
            isOffline={message.isOffline}
          />
        );
      }

      if (message.type === 'invoice-card') {
        return (
          <ProfessionalInvoice
            invoiceData={message.invoiceData}
            invoiceId={message.invoiceId}
            isOffline={message.isOffline}
          />
        );
      }

      if (message.type === 'invoice-card-edited') {
        return (
          <ProfessionalInvoiceWithChanges
            invoiceData={message.invoiceData}
            originalInvoiceData={message.originalInvoiceData}
            invoiceId={message.invoiceId}
            isOffline={message.isOffline}
          />
        );
      }
      
      return null;
    } catch (error) {
      console.error('Error rendering special content:', error);
      return <div>Error rendering component: {error.message}</div>;
    }
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-4xl rounded-xl p-4 shadow-lg ${
        message.sender === 'user' 
          ? 'bg-blue-600 text-white ml-8' 
          : message.type === 'error' 
          ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 mr-8'
          : message.type === 'warning'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 mr-8'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-8'
      }`}>
        <div className="flex items-start">
          {message.sender === 'assistant' && (
            <div className="mr-3 mt-1 flex-shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                message.type === 'error' 
                  ? 'bg-red-500'
                  : message.type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}>
                <span className="text-white text-xs font-bold">
                  {message.type === 'error' ? '⚠' : 'AI'}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">
                {message.sender === 'user' ? 'You' : 'Assistant'}
              </span>
              <span className="text-xs opacity-70">{message.timestamp}</span>
              {message.isOffline && (
                <span className="ml-2 px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                  Offline Mode
                </span>
              )}
            </div>
            
            {message.text && (
              <div className="whitespace-pre-wrap mb-3">{message.text}</div>
            )}
            
            {renderSpecialContent()}
          </div>
          
          {message.sender === 'user' && (
            <div className="ml-3 mt-1 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">You</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
