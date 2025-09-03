
'use client';

import Image from 'next/image';

const ProfessionalInvoiceWithChanges = ({ invoiceData, originalInvoiceData, invoiceId, isOffline = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
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

  const handlePrint = () => {
    // Create a clean print view for edited invoice
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice INV-${invoiceId || '001'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
          }
          
          .invoice-container {
            max-width: 100%;
            background: white;
          }
          
          .header {
            background: #086d32;
            color: white;
            padding: 20px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .footer {
            background: #086d32;
            color: white;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
          }
          
          .content {
            padding: 20px 0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          
          th {
            background: #086d32;
            color: white;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-center {
            text-align: center;
          }
          
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          
          .section-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #086d32;
          }
          
          .sponsors {
            text-align: center;
            margin: 20px 0;
            border-top: 1px solid #ccc;
            padding-top: 15px;
          }
          
          .sponsor-logos {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
          }
          
          .sponsor-logo {
            width: 40px;
            height: 30px;
            object-fit: contain;
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
          <!-- Header -->
          <div class="header">
            <div>
              <img src="/images/logo.png" alt="Company Logo" style="height: 60px; width: auto;">
            </div>
            <div style="text-align: center; flex: 1; margin: 0 20px;">
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Invoice Details -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
              <div>
                <p><strong>Invoice #:</strong> INV-${invoiceId || '001'}</p>
                <p><strong>Date:</strong> ${formatDate(Date.now())}</p>
                <p><strong>Status:</strong> ${data.status?.toUpperCase() || 'COMPLETED'}</p>
              </div>
            </div>
            
            <!-- Bill To Section -->
            <div class="grid-2">
              <div>
                <div class="section-title">Bill To:</div>
                <p style="font-weight: bold;">${data.recipient}</p>
                ${data.building_site?.address ? `<p>${data.building_site.address}</p>` : ''}
                ${data.building_site?.City ? `<p>${data.building_site.City}</p>` : ''}
                ${data.building_site?.city ? `<p>${data.building_site.city}</p>` : ''}
                ${data.building_site?.Postal ? `<p>${data.building_site.Postal}</p>` : ''}
                ${data.building_site?.postal_code ? `<p>${data.building_site.postal_code}</p>` : ''}
                ${data.building_site?.Country ? `<p>${data.building_site.Country}</p>` : ''}
                ${data.building_site?.country ? `<p>${data.building_site.country}</p>` : ''}
              </div>
              <div>
                <div class="section-title">Installation Address:</div>
                ${data.building_site?.address ? `<p>${data.building_site.address}</p>` : ''}
                ${data.building_site?.City ? `<p>${data.building_site.City}</p>` : ''}
                ${data.building_site?.city ? `<p>${data.building_site.city}</p>` : ''}
                ${data.building_site?.Postal ? `<p>${data.building_site.Postal}</p>` : ''}
                ${data.building_site?.postal_code ? `<p>${data.building_site.postal_code}</p>` : ''}
                ${data.building_site?.Country ? `<p>${data.building_site.Country}</p>` : ''}
                ${data.building_site?.country ? `<p>${data.building_site.country}</p>` : ''}
              </div>
            </div>
            
            <!-- Products Table -->
            <table>
              <thead>
                <tr>
                  <th>Product</th>
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
                      <td${hasChanged(item.tipo || item.name, originalItem.tipo || originalItem.name) ? ' class="changed"' : ''}>
                        <strong>${item.tipo || item.name}</strong>
                        ${(item.zona_clim || item.climate_zone) ? 
                          `<br><small style="color: #2563eb;${hasChanged(item.zona_clim || item.climate_zone, originalItem.zona_clim || originalItem.climate_zone) ? ' background-color: #fff3cd;' : ''}">Zone: ${item.zona_clim || item.climate_zone}</small>` : ''}
                      </td>
                      <td${hasChanged(item.descrizione_titolo || item.description, originalItem.descrizione_titolo || originalItem.description) ? ' class="changed"' : ''}>
                        <strong>${item.descrizione_titolo || item.description || ''}</strong>
                        ${item.descrizione ? `<br><small${hasChanged(item.descrizione, originalItem.descrizione) ? ' class="changed"' : ''}>${item.descrizione}</small>` : ''}
                      </td>
                      <td class="text-center${hasChanged(item.quantity, originalItem.quantity) ? ' changed' : ''}">${item.quantity}</td>
                      <td class="text-right${hasChanged(item.unit_price, originalItem.unit_price) ? ' changed' : ''}">€${(item.unit_price || 0).toFixed(2)}</td>
                      <td class="text-right${hasChanged(item.total_price, originalItem.total_price) ? ' changed' : ''}"><strong>€${(item.total_price || 0).toFixed(2)}</strong></td>
                    </tr>
                  `;
                }).join('') || ''}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="display: flex; justify-content: flex-end; margin: 30px 0;">
              <div style="width: 300px; border: 2px solid #ccc; border-radius: 8px; overflow: hidden;">
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f9fafb; border-bottom: 1px solid #ccc;">
                  <span>Subtotal:</span>
                  <span${hasChanged(data.subtotal, originalData.subtotal) ? ' class="changed"' : ''}><strong>€${(data.subtotal || 0).toFixed(2)}</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f9fafb; border-bottom: 1px solid #ccc;">
                  <span>Tax (${((data.tax_rate || 0) * 100).toFixed(1)}%):</span>
                  <span${hasChanged(data.tax_amount, originalData.tax_amount) ? ' class="changed"' : ''}><strong>€${(data.tax_amount || 0).toFixed(2)}</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 15px; background: #086d32; color: white;">
                  <span style="font-size: 18px; font-weight: bold;">Total Amount:</span>
                  <span${hasChanged(data.total_amount, originalData.total_amount) ? ' class="changed"' : ''} style="font-size: 18px; font-weight: bold;">€${(data.total_amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            ${data.notes ? `
              <div style="margin: 30px 0;">
                <div class="section-title">Notes:</div>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p${hasChanged(data.notes, originalData.notes) ? ' class="changed"' : ''}>${data.notes}</p>
                </div>
              </div>
            ` : ''}
            
            <!-- Sponsors -->
            <div class="sponsors">
              <h4 style="font-size: 14px; color: #666; margin-bottom: 10px;">Trusted Partners & Sponsors</h4>
              <div class="sponsor-logos">
                ${Array.from({ length: 10 }, (_, i) => `
                  <img src="/images/sp${i + 1}.png" alt="Sponsor ${i + 1}" class="sponsor-logo">
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p style="font-weight: bold; margin-bottom: 5px;">Sede Legale Via San Gregorio n. 55, 20124 Milano (MI), Italia P.IVA 08206350723</p>
            <p style="margin-bottom: 10px;">SEDE OPERATIVA Via Gravinella s.n.c. – Castellana Grotte (BA) Puglia, Italia</p>
            <div style="display: flex; justify-content: center; gap: 20px;">
              <span>www.greengen.com</span>
              <span>+1 (555) 123-4567</span>
              <span>contact@greengen.com</span>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Invoice Content - This is what gets printed */}
      <div 
        className="print-content bg-white relative" 
        data-invoice-id={`invoice-${invoiceId}`} 
        style={{ minHeight: '29.7cm', fontFamily: 'Arial, sans-serif' }}
      >
        
        {/* Dark Green Header - Will be fixed during print */}
        <div className="print-header bg-[#086d32] text-white p-6 h-24 flex items-center justify-between">
          {/* Logo Space */}
          <div className="rounded-lg flex items-center justify-center">
            <div className="bg-opacity-20 rounded flex items-center justify-center text-xs">
              <img src="/images/logo.png" alt="Company Logo" width={150} height={120} />
            </div>
          </div>
        </div>

        {/* Main Content Area - Will have padding to avoid overlapping with fixed header/footer */}
        <div className="print-main-content p-8">
          {/* Invoice Details */}
          <div className="flex justify-between mb-8">
            <div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold">Invoice #:</span> INV-{invoiceId || '001'}</p>
                <p><span className="font-semibold">Date:</span> {formatDate(Date.now())}</p>
                <p><span className="font-semibold">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">{data.status?.toUpperCase() || 'COMPLETED'}</span></p>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-green-600">Bill To:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-base">
                  {renderWithHighlight(data.recipient, originalData.recipient, 'font-semibold text-base')}
                </p>
                {data.building_site?.address && (
                  <p>{renderWithHighlight(data.building_site.address, originalData.building_site?.address)}</p>
                )}
                {(data.building_site?.City || data.building_site?.city) && (
                  <p>{renderWithHighlight(data.building_site.City || data.building_site.city, originalData.building_site?.City || originalData.building_site?.city)}</p>
                )}
                {(data.building_site?.Postal || data.building_site?.postal_code) && (
                  <p>{renderWithHighlight(data.building_site.Postal || data.building_site.postal_code, originalData.building_site?.Postal || originalData.building_site?.postal_code)}</p>
                )}
                {(data.building_site?.Country || data.building_site?.country) && (
                  <p>{renderWithHighlight(data.building_site.Country || data.building_site.country, originalData.building_site?.Country || originalData.building_site?.country)}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-green-600">Installation Address:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                {data.building_site?.address && (
                  <p>{renderWithHighlight(data.building_site.address, originalData.building_site?.address)}</p>
                )}
                {(data.building_site?.City || data.building_site?.city) && (
                  <p>{renderWithHighlight(data.building_site.City || data.building_site.city, originalData.building_site?.City || originalData.building_site?.city)}</p>
                )}
                {(data.building_site?.Postal || data.building_site?.postal_code) && (
                  <p>{renderWithHighlight(data.building_site.Postal || data.building_site.postal_code, originalData.building_site?.Postal || originalData.building_site?.postal_code)}</p>
                )}
                {(data.building_site?.Country || data.building_site?.country) && (
                  <p>{renderWithHighlight(data.building_site.Country || data.building_site.country, originalData.building_site?.Country || originalData.building_site?.country)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-8">
            <table className="w-full border-2 border-gray-300">
              <thead>
                <tr className="bg-green-800 text-white">
                  <th className="text-left py-3 px-3 font-semibold border-r border-green-600">Product</th>
                  <th className="text-left py-3 px-3 font-semibold border-r border-green-600">Description</th>
                  <th className="text-center py-3 px-3 font-semibold border-r border-green-600 w-16">Qty</th>
                  <th className="text-right py-3 px-3 font-semibold border-r border-green-600">Unit Price</th>
                  <th className="text-right py-3 px-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.products?.map((item, index) => {
                  const originalItem = originalData.products?.[index] || {};
                  return (
                    <tr key={`final-invoice-item-${item.product_id || index}`} className="border-b-2 border-gray-200 hover:bg-gray-50">
                      {/* Product Name Column */}
                      <td className="py-3 px-3 border-r border-gray-200">
                        <div className="font-medium text-gray-900">
                          {renderWithHighlight(item.tipo || item.name || '', originalItem.tipo || originalItem.name || '', 'font-medium text-gray-900')}
                        </div>
                        {(item.zona_clim || item.climate_zone) && (
                          <div className="text-xs text-blue-600 mt-1 font-medium">
                            Zone: {renderWithHighlight(item.zona_clim || item.climate_zone, originalItem.zona_clim || originalItem.climate_zone, 'text-xs text-blue-600 mt-1 font-medium')}
                          </div>
                        )}
                      </td>
                      
                      {/* Description Column */}
                      <td className="py-3 px-3 border-r border-gray-200">
                        {(item.descrizione_titolo || item.description) && (
                          <div className="font-medium text-gray-900">
                            {renderWithHighlight(item.descrizione_titolo || item.description || '', originalItem.descrizione_titolo || originalItem.description || '', 'font-medium text-gray-900')}
                          </div>
                        )}
                        {item.descrizione && (
                          <div className="text-sm text-gray-600 mt-1">
                            {renderWithHighlight(item.descrizione, originalItem.descrizione, 'text-sm text-gray-600 mt-1')}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-900 border-r border-gray-200 font-medium">
                        {renderWithHighlight(item.quantity, originalItem.quantity, 'text-center text-gray-900 border-r border-gray-200 font-medium')}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 border-r border-gray-200">
                        €{renderWithHighlight((item.unit_price || 0).toFixed(2), (originalItem.unit_price || 0).toFixed(2), 'text-right text-gray-900 border-r border-gray-200')}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 font-bold">
                        €{renderWithHighlight((item.total_price || 0).toFixed(2), (originalItem.total_price || 0).toFixed(2), 'text-right text-gray-900 font-bold')}
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
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="space-y-0">
                  <div className="flex justify-between py-3 px-4 border-b border-gray-200 bg-gray-50">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="text-gray-900 font-semibold">
                      {renderWithHighlight(`€${(data.subtotal || data.total || 0).toFixed(2)}`, `€${(originalData.subtotal || originalData.total || 0).toFixed(2)}`, 'text-gray-900 font-semibold')}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 px-4 border-b border-gray-200 bg-gray-50">
                    <span className="text-gray-700 font-medium">
                      Tax ({renderWithHighlight(((data.tax_rate || 0) * 100).toFixed(1), ((originalData.tax_rate || 0) * 100).toFixed(1))}%):
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {renderWithHighlight(`€${(data.tax_amount || 0).toFixed(2)}`, `€${(originalData.tax_amount || 0).toFixed(2)}`, 'text-gray-900 font-semibold')}
                    </span>
                  </div>
                  <div className="flex justify-between py-4 px-4 bg-green-800 text-white">
                    <span className="text-lg font-bold">Total Amount:</span>
                    <span className="text-lg font-bold">
                      {renderWithHighlight(`€${(data.total_amount || data.total || 0).toFixed(2)}`, `€${(originalData.total_amount || originalData.total || 0).toFixed(2)}`, 'text-lg font-bold')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {data.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-green-600">Notes:</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  {renderWithHighlight(data.notes, originalData.notes, 'text-gray-700')}
                </p>
              </div>
            </div>
          )}

          {/* Sponsors/Brands Section */}
          <div className="px-0 pb-4">
            <div className="border-t-2 border-gray-300 pt-4">
              <h4 className="text-center text-sm text-gray-600 mb-3 font-medium">
                Trusted Partners & Sponsors
              </h4>
              <div className="flex justify-center items-center space-x-8 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="w-12 h-12 flex items-center justify-center">
                    <img
                      src={`/images/sp${i + 1}.png`}
                      alt={`Sponsor ${i + 1}`}
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dark Green Footer - Will be fixed during print */}
        <div className="print-footer bg-[#086d32] w-full text-white p-6 h-24 flex items-center justify-center">
          <div className="flex flex-col text-center space-y-2">
            <div className="text-center text-xs">
              <p className="font-medium">Sede Legale Via San Gregorio n. 55, 20124 Milano (MI), Italia P.IVA 08206350723</p>
              <p className="text-green-100 mt-1">SEDE OPERATIVA Via Gravinella s.n.c. – Castellana Grotte (BA) Puglia, Italia</p>
            </div>
            <div className="text-xs flex items-center justify-center space-x-4">
              <p className="font-medium">www.greengen.com</p>
              <p className="mt-1">+1 (555) 123-4567</p>
              <p className="mt-1">contact@greengen.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons - Hidden during print */}
      <div className="print-hide flex flex-col sm:flex-row justify-center mt-6 lg:mt-8 gap-3 lg:gap-4 bg-gray-100 p-4">
        <button
          onClick={handlePrint}
          className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base w-full sm:w-auto active:scale-95"
        >
          Print Invoice
        </button>
    
      </div>

      {/* Print Styles - Only added when printing */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body, html {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-content, .print-content * {
            visibility: visible;
          }
          
          .print-content {
            position: relative;
            width: 100%;
            background: white !important;
            height: auto;
            min-height: 29.7cm;
          }
          
          /* Fixed header for printing */
          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 96px;
            background-color: #086d32 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            z-index: 1000;
          }
          
          /* Fixed footer for printing */
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 96px;
            background-color: #086d32 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            z-index: 1000;
          }
          
          /* Main content area with padding to avoid overlapping */
          .print-main-content {
            padding-top: 100px;
            padding-bottom: 100px;
            width: 100%;
          }
          
          .print-hide {
            display: none !important;
          }
          
          /* Ensure colors print correctly */
          .print-content .bg-green-800 {
            background-color: #086d32 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print-content .text-white {
            color: white !important;
          }
          
          .print-content .bg-gray-50 {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
          }
          
          .print-content .bg-green-50 {
            background-color: #f0fdf4 !important;
            -webkit-print-color-adjust: exact;
          }
          
          .print-content .bg-yellow-200 {
            background-color: #fff3cd !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalInvoiceWithChanges;