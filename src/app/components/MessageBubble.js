'use client';

import { useState } from 'react';
import ProductSelection from './ProductSelection';

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
                    {item.name}
                    {item.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">{item.description}</div>
                    )}
                    {item.climate_zone && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-normal mt-1">Zone: {item.climate_zone}</div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                    <span className="text-gray-600 dark:text-gray-400">€{(item.unit_price || 0).toFixed(2)}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{(item.total_price || 0).toFixed(2)}</span>
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
                        <div className="font-medium text-sm lg:text-base">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                        )}
                        {item.climate_zone && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">Zone: {item.climate_zone}</div>
                        )}
                      </td>
                      <td className="py-2 text-center text-gray-900 dark:text-white text-sm lg:text-base">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-900 dark:text-white text-sm lg:text-base">€{(item.unit_price || 0).toFixed(2)}</td>
                      <td className="py-2 text-right text-gray-900 dark:text-white text-sm lg:text-base">€{(item.total_price || (item.quantity * item.unit_price) || 0).toFixed(2)}</td>
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
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden" data-invoice-id={`invoice-${invoiceId}`}>
      {/* Invoice Paper Effect */}
      <div className="bg-white p-4 lg:p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-xs lg:text-sm text-gray-600">
              <p className="font-semibold">GreenGen Energy Solutions</p>
              <p>123 Business Street</p>
              <p>Business City, State 12345</p>
              <p>Email: contact@greengen.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <div className="text-xs lg:text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Invoice #:</span> INV-{invoiceId}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(invoiceData.created_at)}</p>
              <p><span className="font-semibold">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">{invoiceData.status?.toUpperCase()}</span></p>
            </div>
            {/* Prominent Total Display */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center lg:text-right">
                <div className="text-xs text-green-600 font-medium">TOTAL AMOUNT</div>
                <div className="text-xl lg:text-2xl font-bold text-green-800">
                  €{(data.total_amount || data.total || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="text-xs lg:text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-sm lg:text-base">{data.recipient}</p>
              {data.building_site?.address && <p>{data.building_site.address}</p>}
              {data.building_site?.city && <p>{data.building_site.city}</p>}
              {data.building_site?.postal_code && <p>{data.building_site.postal_code}</p>}
              {data.building_site?.country && <p>{data.building_site.country}</p>}
            </div>
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3">Installation Address:</h3>
            <div className="text-xs lg:text-sm text-gray-700 space-y-1">
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
                <span className="text-gray-900 font-medium">€{(data.subtotal || data.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Tax ({((data.tax_rate || 0) * 100).toFixed(1)}%):</span>
                <span className="text-gray-900 font-medium">€{(data.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-lg font-bold text-gray-900">€{(data.total_amount || data.total || 0).toFixed(2)}</span>
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
        <div className="flex flex-col sm:flex-row justify-center mt-6 lg:mt-8 gap-3 lg:gap-4 print:hidden">
          <button
            onClick={() => {
              // Create a clean print view
              const printWindow = window.open('', '_blank');
              const invoiceContent = document.querySelector(`[data-invoice-id="invoice-${invoiceId}"]`);
              
              if (invoiceContent) {
                printWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Invoice INV-${invoiceId}</title>
                    <style>
                      @page {
                        size: A4;
                        margin: 0.5in;
                      }
                      body {
                        font-family: Arial, sans-serif;
                        line-height: 1.4;
                        color: #000;
                        background: white;
                        margin: 0;
                        padding: 0;
                      }
                      .invoice-container {
                        max-width: 100%;
                        background: white;
                      }
                      table {
                        width: 100%;
                        border-collapse: collapse;
                      }
                      th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                      }
                      th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                      }
                      .text-right {
                        text-align: right;
                      }
                      .text-center {
                        text-align: center;
                      }
                      .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                      }
                      .company-info {
                        font-size: 12px;
                      }
                      .invoice-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                      }
                      .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 20px 0 10px 0;
                      }
                      .totals-section {
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-end;
                      }
                      .totals-table {
                        width: 300px;
                      }
                      .notes-section {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                      }
                      .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 15px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="invoice-container">
                      <div class="header">
                        <div>
                          <div class="invoice-title">INVOICE</div>
                          <div class="company-info">
                            <strong>GreenGen Energy Solutions</strong><br>
                            123 Business Street<br>
                            Business City, State 12345<br>
                            Email: contact@greengen.com<br>
                            Phone: +1 (555) 123-4567
                          </div>
                        </div>
                        <div style="text-align: right;">
                          <div><strong>Invoice #:</strong> INV-${invoiceId}</div>
                          <div><strong>Date:</strong> ${formatDate(invoiceData.created_at)}</div>
                          <div><strong>Status:</strong> ${invoiceData.status?.toUpperCase()}</div>
                        </div>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                        <div>
                          <div class="section-title">Bill To:</div>
                          <strong>${data.recipient}</strong><br>
                          ${data.building_site?.address || ''}<br>
                          ${data.building_site?.city || ''}<br>
                          ${data.building_site?.postal_code || ''}<br>
                          ${data.building_site?.country || ''}
                        </div>
                        <div>
                          <div class="section-title">Installation Address:</div>
                          ${data.building_site?.address || ''}<br>
                          ${data.building_site?.city || ''}<br>
                          ${data.building_site?.postal_code || ''}<br>
                          ${data.building_site?.country || ''}
                        </div>
                      </div>
                      
                      <table>
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${data.products?.map(item => `
                            <tr>
                              <td>
                                <strong>${item.name}</strong>
                                ${item.description ? `<br><small>${item.description}</small>` : ''}
                                ${item.climate_zone ? `<br><small style="color: #0066cc;">Climate Zone: ${item.climate_zone}</small>` : ''}
                              </td>
                              <td class="text-center">${item.quantity}</td>
                              <td class="text-right">€${(item.unit_price || 0).toFixed(2)}</td>
                              <td class="text-right"><strong>€${(item.total_price || 0).toFixed(2)}</strong></td>
                            </tr>
                          `).join('') || ''}
                        </tbody>
                      </table>
                      
                      <div class="totals-section">
                        <table class="totals-table">
                          <tr>
                            <td>Subtotal:</td>
                            <td class="text-right"><strong>€${(data.subtotal || 0).toFixed(2)}</strong></td>
                          </tr>
                          <tr>
                            <td>Tax (${((data.tax_rate || 0) * 100).toFixed(1)}%):</td>
                            <td class="text-right"><strong>€${(data.tax_amount || 0).toFixed(2)}</strong></td>
                          </tr>
                          <tr style="border-top: 2px solid #333;">
                            <td><strong>Total Amount:</strong></td>
                            <td class="text-right"><strong>€${(data.total_amount || 0).toFixed(2)}</strong></td>
                          </tr>
                        </table>
                      </div>
                      
                      ${data.notes ? `
                        <div class="notes-section">
                          <div class="section-title">Notes:</div>
                          <p>${data.notes}</p>
                        </div>
                      ` : ''}
                      
                      <div class="footer">
                        <p>Thank you for your business!</p>
                        <p>For questions about this invoice, please contact us at contact@greengen.com</p>
                      </div>
                    </div>
                  </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                  printWindow.print();
                  printWindow.close();
                }, 250);
              }
            }}
            className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base w-full sm:w-auto active:scale-95"
          >
            Print Invoice
          </button>
          <button
            onClick={async () => {
              try {
                // Create HTML content for PDF generation
                const htmlContent = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <title>Invoice INV-${invoiceId}</title>
                    <style>
                      @page {
                        size: A4;
                        margin: 0.5in;
                      }
                      body {
                        font-family: Arial, sans-serif;
                        line-height: 1.4;
                        color: #000;
                        background: white;
                        margin: 0;
                        padding: 0;
                      }
                      .invoice-container {
                        max-width: 100%;
                        background: white;
                      }
                      table {
                        width: 100%;
                        border-collapse: collapse;
                      }
                      th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                      }
                      th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                      }
                      .text-right {
                        text-align: right;
                      }
                      .text-center {
                        text-align: center;
                      }
                      .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                      }
                      .company-info {
                        font-size: 12px;
                      }
                      .invoice-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                      }
                      .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 20px 0 10px 0;
                      }
                      .totals-section {
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-end;
                      }
                      .totals-table {
                        width: 300px;
                      }
                      .notes-section {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                      }
                      .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 15px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="invoice-container">
                      <div class="header">
                        <div>
                          <div class="invoice-title">INVOICE</div>
                          <div class="company-info">
                            <strong>GreenGen Energy Solutions</strong><br>
                            123 Business Street<br>
                            Business City, State 12345<br>
                            Email: contact@greengen.com<br>
                            Phone: +1 (555) 123-4567
                          </div>
                        </div>
                        <div style="text-align: right;">
                          <div><strong>Invoice #:</strong> INV-${invoiceId}</div>
                          <div><strong>Date:</strong> ${formatDate(invoiceData.created_at)}</div>
                          <div><strong>Status:</strong> ${invoiceData.status?.toUpperCase()}</div>
                        </div>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                        <div>
                          <div class="section-title">Bill To:</div>
                          <strong>${data.recipient}</strong><br>
                          ${data.building_site?.address || ''}<br>
                          ${data.building_site?.city || ''}<br>
                          ${data.building_site?.postal_code || ''}<br>
                          ${data.building_site?.country || ''}
                        </div>
                        <div>
                          <div class="section-title">Installation Address:</div>
                          ${data.building_site?.address || ''}<br>
                          ${data.building_site?.city || ''}<br>
                          ${data.building_site?.postal_code || ''}<br>
                          ${data.building_site?.country || ''}
                        </div>
                      </div>
                      
                      <table>
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${data.products?.map(item => `
                            <tr>
                              <td>
                                <strong>${item.name}</strong>
                                ${item.description ? `<br><small>${item.description}</small>` : ''}
                                ${item.climate_zone ? `<br><small style="color: #0066cc;">Climate Zone: ${item.climate_zone}</small>` : ''}
                              </td>
                              <td class="text-center">${item.quantity}</td>
                              <td class="text-right">€${(item.unit_price || 0).toFixed(2)}</td>
                              <td class="text-right"><strong>€${(item.total_price || 0).toFixed(2)}</strong></td>
                            </tr>
                          `).join('') || ''}
                        </tbody>
                      </table>
                      
                      <div class="totals-section">
                        <table class="totals-table">
                          <tr>
                            <td>Subtotal:</td>
                            <td class="text-right"><strong>€${(data.subtotal || 0).toFixed(2)}</strong></td>
                          </tr>
                          <tr>
                            <td>Tax (${((data.tax_rate || 0) * 100).toFixed(1)}%):</td>
                            <td class="text-right"><strong>€${(data.tax_amount || 0).toFixed(2)}</strong></td>
                          </tr>
                          <tr style="border-top: 2px solid #333;">
                            <td><strong>Total Amount:</strong></td>
                            <td class="text-right"><strong>€${(data.total_amount || 0).toFixed(2)}</strong></td>
                          </tr>
                        </table>
                      </div>
                      
                      ${data.notes ? `
                        <div class="notes-section">
                          <div class="section-title">Notes:</div>
                          <p>${data.notes}</p>
                        </div>
                      ` : ''}
                      
                      <div class="footer">
                        <p>Thank you for your business!</p>
                        <p>For questions about this invoice, please contact us at contact@greengen.com</p>
                      </div>
                    </div>
                  </body>
                  </html>
                `;

                // Use browser's print to PDF functionality
                const printWindow = window.open('', '_blank');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                
                setTimeout(() => {
                  // Trigger print dialog which will allow saving as PDF
                  printWindow.print();
                }, 500);
                
              } catch (error) {
                console.error('Error generating PDF:', error);
                // Fallback to original JSON download
                const element = document.createElement('a');
                const file = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `invoice-${invoiceId}.json`;
                element.click();
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download PDF
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Invoice Paper Effect */}
      <div className="bg-white p-4 lg:p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 lg:mb-8 space-y-4 lg:space-y-0">
          <div className="order-2 lg:order-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-xs lg:text-sm text-gray-600">
              <p className="font-semibold">
                {renderWithHighlight(data.sender || 'GreenGen Energy Solutions', originalData.sender, 'font-semibold')}
              </p>
              <p>123 Business Street</p>
              <p>Business City, State 12345</p>
              <p>Email: contact@greengen.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 text-left lg:text-right">
            <div className="text-xs lg:text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Invoice #:</span> INV-{invoiceId}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(invoiceData.created_at)}</p>
              <p><span className="font-semibold">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">{invoiceData.status?.toUpperCase()}</span></p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3">Bill To:</h3>
            <div className="text-xs lg:text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-sm lg:text-base">
                {renderWithHighlight(data.recipient, originalData.recipient, 'font-semibold text-sm lg:text-base')}
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
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3">Installation Address:</h3>
            <div className="text-xs lg:text-sm text-gray-700 space-y-1">
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
        <div className="mb-6 lg:mb-8 overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">Description</th>
                <th className="text-center py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">Qty</th>
                <th className="text-right py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">Unit Price</th>
                <th className="text-right py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-xs lg:text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.products?.map((item, index) => {
                const originalItem = originalData.products?.[index] || {};
                return (
                  <tr key={`edited-invoice-item-${item.product_id || index}`} className="border-b border-gray-200">
                    <td className="py-2 lg:py-3 px-2 lg:px-4">
                      <div className="font-medium text-gray-900 text-xs lg:text-sm">
                        {renderWithHighlight(item.name, originalItem.name, 'font-medium text-gray-900 text-xs lg:text-sm')}
                      </div>
                      {item.description && (
                        <div className="text-xs lg:text-sm text-gray-600 mt-1">
                          {renderWithHighlight(item.description, originalItem.description, 'text-xs lg:text-sm text-gray-600 mt-1')}
                        </div>
                      )}
                      {item.climate_zone && (
                        <div className="text-xs text-blue-600 mt-1">
                          Climate Zone: {renderWithHighlight(item.climate_zone, originalItem.climate_zone, 'text-xs text-blue-600')}
                        </div>
                      )}
                    </td>
                    <td className="py-2 lg:py-3 px-2 lg:px-4 text-center text-gray-900 text-xs lg:text-sm">
                      {renderWithHighlight(item.quantity, originalItem.quantity, 'text-center text-gray-900 text-xs lg:text-sm')}
                    </td>
                    <td className="py-2 lg:py-3 px-2 lg:px-4 text-right text-gray-900 text-xs lg:text-sm">
                      €{renderWithHighlight((item.unit_price || 0).toFixed(2), (originalItem.unit_price || 0).toFixed(2), 'text-right text-gray-900 text-xs lg:text-sm')}
                    </td>
                    <td className="py-2 lg:py-3 px-2 lg:px-4 text-right text-gray-900 font-medium text-xs lg:text-sm">
                      €{renderWithHighlight((item.total_price || 0).toFixed(2), (originalItem.total_price || 0).toFixed(2), 'text-right text-gray-900 font-medium text-xs lg:text-sm')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-center lg:justify-end mb-6 lg:mb-8">
          <div className="w-full max-w-sm lg:w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700 text-xs lg:text-sm">Subtotal:</span>
                <span className="text-gray-900 font-medium text-xs lg:text-sm">
                  €{renderWithHighlight((data.subtotal || 0).toFixed(2), (originalData.subtotal || 0).toFixed(2), 'text-gray-900 font-medium text-xs lg:text-sm')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700 text-xs lg:text-sm">
                  Tax ({renderWithHighlight(((data.tax_rate || 0) * 100).toFixed(1), ((originalData.tax_rate || 0) * 100).toFixed(1))}%):
                </span>
                <span className="text-gray-900 font-medium text-xs lg:text-sm">
                  €{renderWithHighlight((data.tax_amount || 0).toFixed(2), (originalData.tax_amount || 0).toFixed(2), 'text-gray-900 font-medium text-xs lg:text-sm')}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-base lg:text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-base lg:text-lg font-bold text-gray-900">
                  €{renderWithHighlight((data.total_amount || 0).toFixed(2), (originalData.total_amount || 0).toFixed(2), 'text-base lg:text-lg font-bold text-gray-900')}
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
            {/* <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                🎯 <span className="bg-yellow-200 px-2 py-1 rounded">Changes highlighted in yellow</span>
              </p>
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center mt-6 lg:mt-8 gap-2 sm:gap-4 print:hidden px-4">
          <button
            onClick={() => {
              // Create a clean print view for edited invoice
              const printWindow = window.open('', '_blank');
              
              printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Invoice INV-${invoiceId} (Edited)</title>
                  <style>
                    @page {
                      size: A4;
                      margin: 0.5in;
                    }
                    body {
                      font-family: Arial, sans-serif;
                      line-height: 1.4;
                      color: #000;
                      background: white;
                      margin: 0;
                      padding: 0;
                    }
                    .invoice-container {
                      max-width: 100%;
                      background: white;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    th, td {
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: left;
                    }
                    th {
                      background-color: #f5f5f5;
                      font-weight: bold;
                    }
                    .text-right {
                      text-align: right;
                    }
                    .text-center {
                      text-align: center;
                    }
                    .header {
                      display: flex;
                      justify-content: space-between;
                      margin-bottom: 30px;
                    }
                    .company-info {
                      font-size: 12px;
                    }
                    .invoice-title {
                      font-size: 24px;
                      font-weight: bold;
                      margin-bottom: 10px;
                    }
                    .section-title {
                      font-size: 16px;
                      font-weight: bold;
                      margin: 20px 0 10px 0;
                    }
                    .totals-section {
                      margin-top: 20px;
                      display: flex;
                      justify-content: flex-end;
                    }
                    .totals-table {
                      width: 300px;
                    }
                    .notes-section {
                      margin-top: 20px;
                      padding: 15px;
                      background-color: #f9f9f9;
                      border-radius: 5px;
                    }
                    .footer {
                      margin-top: 30px;
                      text-align: center;
                      font-size: 12px;
                      color: #666;
                      border-top: 1px solid #ddd;
                      padding-top: 15px;
                    }
                    .changed {
                      background-color: #fff3cd;
                      padding: 2px 4px;
                      border-radius: 3px;
                    }
                  </style>
                </head>
                <body>
                  <div class="invoice-container">
                    <div class="header">
                      <div>
                        <div class="invoice-title">INVOICE</div>
                        <div class="company-info">
                          <strong>GreenGen Energy Solutions</strong><br>
                          123 Business Street<br>
                          Business City, State 12345<br>
                          Email: contact@greengen.com<br>
                          Phone: +1 (555) 123-4567
                        </div>
                      </div>
                      <div style="text-align: right;">
                        <div><strong>Invoice #:</strong> INV-${invoiceId}</div>
                        <div><strong>Date:</strong> ${formatDate(invoiceData.created_at)}</div>
                        <div><strong>Status:</strong> ${invoiceData.status?.toUpperCase()}</div>
                      </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                      <div>
                        <div class="section-title">Bill To:</div>
                        <strong${hasChanged(data.recipient, originalData.recipient) ? ' class="changed"' : ''}>${data.recipient}</strong><br>
                        ${data.building_site?.address ? `<span${hasChanged(data.building_site.address, originalData.building_site?.address) ? ' class="changed"' : ''}>${data.building_site.address}</span><br>` : ''}
                        ${data.building_site?.city ? `<span${hasChanged(data.building_site.city, originalData.building_site?.city) ? ' class="changed"' : ''}>${data.building_site.city}</span><br>` : ''}
                        ${data.building_site?.postal_code ? `<span${hasChanged(data.building_site.postal_code, originalData.building_site?.postal_code) ? ' class="changed"' : ''}>${data.building_site.postal_code}</span><br>` : ''}
                        ${data.building_site?.country ? `<span${hasChanged(data.building_site.country, originalData.building_site?.country) ? ' class="changed"' : ''}>${data.building_site.country}</span>` : ''}
                      </div>
                      <div>
                        <div class="section-title">Installation Address:</div>
                        ${data.building_site?.address ? `<span${hasChanged(data.building_site.address, originalData.building_site?.address) ? ' class="changed"' : ''}>${data.building_site.address}</span><br>` : ''}
                        ${data.building_site?.city ? `<span${hasChanged(data.building_site.city, originalData.building_site?.city) ? ' class="changed"' : ''}>${data.building_site.city}</span><br>` : ''}
                        ${data.building_site?.postal_code ? `<span${hasChanged(data.building_site.postal_code, originalData.building_site?.postal_code) ? ' class="changed"' : ''}>${data.building_site.postal_code}</span><br>` : ''}
                        ${data.building_site?.country ? `<span${hasChanged(data.building_site.country, originalData.building_site?.country) ? ' class="changed"' : ''}>${data.building_site.country}</span>` : ''}
                      </div>
                    </div>
                    
                    <table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th class="text-center">Qty</th>
                          <th class="text-right">Unit Price</th>
                          <th class="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${data.products?.map((item, index) => {
                          const originalItem = originalData.products?.[index] || {};
                          return `
                            <tr>
                              <td>
                                <strong${hasChanged(item.name, originalItem.name) ? ' class="changed"' : ''}>${item.name}</strong>
                                ${item.description ? `<br><small${hasChanged(item.description, originalItem.description) ? ' class="changed"' : ''}>${item.description}</small>` : ''}
                                ${item.climate_zone ? `<br><small style="color: #0066cc;${hasChanged(item.climate_zone, originalItem.climate_zone) ? ' background-color: #fff3cd;' : ''}">Climate Zone: ${item.climate_zone}</small>` : ''}
                              </td>
                              <td class="text-center${hasChanged(item.quantity, originalItem.quantity) ? ' changed' : ''}">${item.quantity}</td>
                              <td class="text-right${hasChanged(item.unit_price, originalItem.unit_price) ? ' changed' : ''}">€${(item.unit_price || 0).toFixed(2)}</td>
                              <td class="text-right${hasChanged(item.total_price, originalItem.total_price) ? ' changed' : ''}"><strong>€${(item.total_price || 0).toFixed(2)}</strong></td>
                            </tr>
                          `;
                        }).join('') || ''}
                      </tbody>
                    </table>
                    
                    <div class="totals-section">
                      <table class="totals-table">
                        <tr>
                          <td>Subtotal:</td>
                          <td class="text-right${hasChanged(data.subtotal, originalData.subtotal) ? ' changed' : ''}"><strong>€${(data.subtotal || 0).toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                          <td>Tax (${((data.tax_rate || 0) * 100).toFixed(1)}%):</td>
                          <td class="text-right${hasChanged(data.tax_amount, originalData.tax_amount) ? ' changed' : ''}"><strong>€${(data.tax_amount || 0).toFixed(2)}</strong></td>
                        </tr>
                        <tr style="border-top: 2px solid #333;">
                          <td><strong>Total Amount:</strong></td>
                          <td class="text-right${hasChanged(data.total_amount, originalData.total_amount) ? ' changed' : ''}"><strong>€${(data.total_amount || 0).toFixed(2)}</strong></td>
                        </tr>
                      </table>
                    </div>
                    
                    ${data.notes ? `
                      <div class="notes-section">
                        <div class="section-title">Notes:</div>
                        <p${hasChanged(data.notes, originalData.notes) ? ' class="changed"' : ''}>${data.notes}</p>
                      </div>
                    ` : ''}
                    
                    <div class="footer">
                      <p>Thank you for your business!</p>
                      <p>For questions about this invoice, please contact us at contact@greengen.com</p>
                      <div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border-radius: 5px;">
                        <strong>Note:</strong> Highlighted areas indicate changes made to the original invoice.
                      </div>
                    </div>
                  </div>
                </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.focus();
              setTimeout(() => {
                printWindow.print();
                printWindow.close();
              }, 250);
            }}
            className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
          >
            Print Invoice
          </button>
          <button
            onClick={async () => {
              try {
                // Create HTML content for PDF generation with changes highlighted
                const htmlContent = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <title>Invoice INV-${invoiceId} (Edited)</title>
                    <style>
                      @page {
                        size: A4;
                        margin: 0.5in;
                      }
                      body {
                        font-family: Arial, sans-serif;
                        line-height: 1.4;
                        color: #000;
                        background: white;
                        margin: 0;
                        padding: 0;
                      }
                      .invoice-container {
                        max-width: 100%;
                        background: white;
                      }
                      table {
                        width: 100%;
                        border-collapse: collapse;
                      }
                      th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                      }
                      th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                      }
                      .text-right {
                        text-align: right;
                      }
                      .text-center {
                        text-align: center;
                      }
                      .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                      }
                      .company-info {
                        font-size: 12px;
                      }
                      .invoice-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                      }
                      .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 20px 0 10px 0;
                      }
                      .totals-section {
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-end;
                      }
                      .totals-table {
                        width: 300px;
                      }
                      .notes-section {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                      }
                      .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 15px;
                      }
                      .changed {
                        background-color: #fff3cd;
                        padding: 2px 4px;
                        border-radius: 3px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="invoice-container">
                      <div class="header">
                        <div>
                          <div class="invoice-title">INVOICE</div>
                          <div class="company-info">
                            <strong>GreenGen Energy Solutions</strong><br>
                            123 Business Street<br>
                            Business City, State 12345<br>
                            Email: contact@greengen.com<br>
                            Phone: +1 (555) 123-4567
                          </div>
                        </div>
                        <div style="text-align: right;">
                          <div><strong>Invoice #:</strong> INV-${invoiceId}</div>
                          <div><strong>Date:</strong> ${formatDate(invoiceData.created_at)}</div>
                          <div><strong>Status:</strong> ${invoiceData.status?.toUpperCase()}</div>
                        </div>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                        <div>
                          <div class="section-title">Bill To:</div>
                          <strong${hasChanged(data.recipient, originalData.recipient) ? ' class="changed"' : ''}>${data.recipient}</strong><br>
                          ${data.building_site?.address ? `<span${hasChanged(data.building_site.address, originalData.building_site?.address) ? ' class="changed"' : ''}>${data.building_site.address}</span><br>` : ''}
                          ${data.building_site?.city ? `<span${hasChanged(data.building_site.city, originalData.building_site?.city) ? ' class="changed"' : ''}>${data.building_site.city}</span><br>` : ''}
                          ${data.building_site?.postal_code ? `<span${hasChanged(data.building_site.postal_code, originalData.building_site?.postal_code) ? ' class="changed"' : ''}>${data.building_site.postal_code}</span><br>` : ''}
                          ${data.building_site?.country ? `<span${hasChanged(data.building_site.country, originalData.building_site?.country) ? ' class="changed"' : ''}>${data.building_site.country}</span>` : ''}
                        </div>
                        <div>
                          <div class="section-title">Installation Address:</div>
                          ${data.building_site?.address ? `<span${hasChanged(data.building_site.address, originalData.building_site?.address) ? ' class="changed"' : ''}>${data.building_site.address}</span><br>` : ''}
                          ${data.building_site?.city ? `<span${hasChanged(data.building_site.city, originalData.building_site?.city) ? ' class="changed"' : ''}>${data.building_site.city}</span><br>` : ''}
                          ${data.building_site?.postal_code ? `<span${hasChanged(data.building_site.postal_code, originalData.building_site?.postal_code) ? ' class="changed"' : ''}>${data.building_site.postal_code}</span><br>` : ''}
                          ${data.building_site?.country ? `<span${hasChanged(data.building_site.country, originalData.building_site?.country) ? ' class="changed"' : ''}>${data.building_site.country}</span>` : ''}
                        </div>
                      </div>
                      
                      <table>
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${data.products?.map((item, index) => {
                            const originalItem = originalData.products?.[index] || {};
                            return `
                              <tr>
                                <td>
                                  <strong${hasChanged(item.name, originalItem.name) ? ' class="changed"' : ''}>${item.name}</strong>
                                  ${item.description ? `<br><small${hasChanged(item.description, originalItem.description) ? ' class="changed"' : ''}>${item.description}</small>` : ''}
                                  ${item.climate_zone ? `<br><small style="color: #0066cc;${hasChanged(item.climate_zone, originalItem.climate_zone) ? ' background-color: #fff3cd;' : ''}">Climate Zone: ${item.climate_zone}</small>` : ''}
                                </td>
                                <td class="text-center${hasChanged(item.quantity, originalItem.quantity) ? ' changed' : ''}">${item.quantity}</td>
                                <td class="text-right${hasChanged(item.unit_price, originalItem.unit_price) ? ' changed' : ''}">€${(item.unit_price || 0).toFixed(2)}</td>
                                <td class="text-right${hasChanged(item.total_price, originalItem.total_price) ? ' changed' : ''}"><strong>€${(item.total_price || 0).toFixed(2)}</strong></td>
                              </tr>
                            `;
                          }).join('') || ''}
                        </tbody>
                      </table>
                      
                      <div class="totals-section">
                        <table class="totals-table">
                          <tr>
                            <td>Subtotal:</td>
                            <td class="text-right${hasChanged(data.subtotal, originalData.subtotal) ? ' changed' : ''}"><strong>€${(data.subtotal || 0).toFixed(2)}</strong></td>
                          </tr>
                          <tr>
                            <td>Tax (${((data.tax_rate || 0) * 100).toFixed(1)}%):</td>
                            <td class="text-right${hasChanged(data.tax_amount, originalData.tax_amount) ? ' changed' : ''}"><strong>€${(data.tax_amount || 0).toFixed(2)}</strong></td>
                          </tr>
                          <tr style="border-top: 2px solid #333;">
                            <td><strong>Total Amount:</strong></td>
                            <td class="text-right${hasChanged(data.total_amount, originalData.total_amount) ? ' changed' : ''}"><strong>€${(data.total_amount || 0).toFixed(2)}</strong></td>
                          </tr>
                        </table>
                      </div>
                      
                      ${data.notes ? `
                        <div class="notes-section">
                          <div class="section-title">Notes:</div>
                          <p${hasChanged(data.notes, originalData.notes) ? ' class="changed"' : ''}>${data.notes}</p>
                        </div>
                      ` : ''}
                      
                      <div class="footer">
                        <p>Thank you for your business!</p>
                        <p>For questions about this invoice, please contact us at contact@greengen.com</p>
                        <div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border-radius: 5px;">
                          <strong>Note:</strong> Highlighted areas indicate changes made to the original invoice.
                        </div>
                      </div>
                    </div>
                  </body>
                  </html>
                `;

                // Use browser's print to PDF functionality
                const printWindow = window.open('', '_blank');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                
                setTimeout(() => {
                  // Trigger print dialog which will allow saving as PDF
                  printWindow.print();
                }, 500);
                
              } catch (error) {
                console.error('Error generating PDF:', error);
                // Fallback to original JSON download
                const element = document.createElement('a');
                const file = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `invoice-${invoiceId}-edited.json`;
                element.click();
              }
            }}
            className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base"
          >
            Download PDF
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
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 lg:mb-6 px-2 lg:px-0`}>
      <div className={`max-w-full lg:max-w-4xl rounded-xl p-3 lg:p-4 shadow-lg ${
        message.sender === 'user' 
          ? 'bg-blue-600 text-white ml-4 lg:ml-8' 
          : message.type === 'error' 
          ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 mr-4 lg:mr-8'
          : message.type === 'warning'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 mr-4 lg:mr-8'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-4 lg:mr-8'
      }`}>
        <div className="flex items-start">
          {message.sender === 'assistant' && (
            <div className="mr-2 lg:mr-3 mt-1 flex-shrink-0">
              <div className={`h-7 w-7 lg:h-8 lg:w-8 rounded-full flex items-center justify-center ${
                message.type === 'error' 
                  ? 'bg-red-500'
                  : message.type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-green-700 to-blue-500'
              }`}>
                <span className="text-white text-xs font-bold">
                  {message.type === 'error' ? '⚠' : 'G'}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1 lg:mb-2 flex-wrap">
              <span className="font-semibold  mr-2 text-sm lg:text-base">
                {message.sender === 'user' ? 'You' : 'GreenGenius'}
              </span>
              <span className="text-xs opacity-70">{message.timestamp}</span>
              {message.isOffline && (
                <span className="ml-1 lg:ml-2 px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                  Offline Mode
                </span>
              )}
            </div>
            
            {message.text && (
              <div className="whitespace-pre-wrap mb-2 lg:mb-3 text-sm lg:text-base break-words">{message.text}</div>
            )}
            
            {renderSpecialContent()}
          </div>
          
          {message.sender === 'user' && (
            <div className="ml-2 lg:ml-3 mt-1 flex-shrink-0">
              <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
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
