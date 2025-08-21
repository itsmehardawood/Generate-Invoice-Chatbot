'use client';

const InvoiceCard = ({ invoiceData, invoiceId, isOffline = false }) => {
  const calculateSubtotal = () => {
    // Handle both old and new data structures
    const items = invoiceData.items || invoiceData.products || [];
    return items.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const price = item.unit_price || item.price || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const calculateTax = () => {
    // Use backend values if available
    if (invoiceData.tax_amount) {
      return invoiceData.tax_amount;
    }
    const taxRate = invoiceData.tax_rate ? invoiceData.tax_rate * 100 : (invoiceData.taxRate || 0);
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    // Use backend values if available
    if (invoiceData.total_amount) {
      return invoiceData.total_amount;
    }
    return calculateSubtotal() + calculateTax();
  };

  const handleDownload = () => {
    if (isOffline) {
      alert('Download functionality is not available in offline mode. Please connect to the backend.');
      return;
    }
    // This would integrate with a PDF generation library
    alert('Download functionality would be implemented here');
  };

  const handleEmail = () => {
    if (isOffline) {
      alert('Email functionality is not available in offline mode. Please connect to the backend.');
      return;
    }
    // This would integrate with email service
    alert('Email functionality would be implemented here');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">INVOICE</h2>
            {isOffline && (
              <span className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                Preview Only - Not Saved
              </span>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">#{invoiceData.invoiceNumber}</p>
          {invoiceId && !isOffline && (
            <p className="text-sm text-gray-500 dark:text-gray-500">Database ID: {invoiceId}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Date: {invoiceData.date}</p>
          {invoiceData.dueDate && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Due: {invoiceData.dueDate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bill From */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">From:</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p className="font-medium text-gray-900 dark:text-white">{invoiceData.billFrom.name}</p>
            <p>{invoiceData.billFrom.company}</p>
            <p>{invoiceData.billFrom.address}</p>
            <p>{invoiceData.billFrom.city}, {invoiceData.billFrom.state} {invoiceData.billFrom.zip}</p>
            <p>{invoiceData.billFrom.email}</p>
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">To:</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p className="font-medium text-gray-900 dark:text-white">{invoiceData.billTo.name}</p>
            <p>{invoiceData.billTo.company}</p>
            <p>{invoiceData.billTo.address}</p>
            <p>{invoiceData.billTo.city}, {invoiceData.billTo.state} {invoiceData.billTo.zip}</p>
            <p>{invoiceData.billTo.email}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                <th className="text-center py-3 text-sm font-semibold text-gray-900 dark:text-white">Qty</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-900 dark:text-white">Rate</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(invoiceData.items || invoiceData.products || []).map((item, index) => (
                <tr key={`invoice-item-${item.product_id || item.id || index}-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-900 dark:text-white">
                    <div className="font-medium">{item.name || item.product_name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                    )}
                    {item.climate_zone && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">Zone: {item.climate_zone}</div>
                    )}
                  </td>
                  <td className="py-3 text-center text-gray-900 dark:text-white">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-900 dark:text-white">€{(item.unit_price || item.price || 0).toFixed(2)}</td>
                  <td className="py-3 text-right text-gray-900 dark:text-white">€{((item.quantity || 0) * (item.unit_price || item.price || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-900 dark:text-white">€{calculateSubtotal().toFixed(2)}</span>
            </div>
            {(invoiceData.tax_rate || invoiceData.taxRate) > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Tax ({((invoiceData.tax_rate || invoiceData.taxRate || 0) * (invoiceData.tax_rate ? 100 : 1)).toFixed(1)}%):</span>
                <span className="text-gray-900 dark:text-white">€{calculateTax().toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex justify-between py-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">€{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{invoiceData.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleDownload}
          disabled={isOffline}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            isOffline
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={handleEmail}
          disabled={isOffline}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            isOffline
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Send Email
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
