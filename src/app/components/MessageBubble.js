// reloadKey, setReloadKey
'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductSelection from './ProductSelection';
import InlineInvoicePreview from './InlineInvoicePreview';
import ExactHtmlInvoiceTemplate from './ExactHtmlInvoiceTemplate';
import ProfessionalInvoiceWithNewChanges from './ProfessionalInvoiceWithNewChanges';

const MessageBubble = ({ 
  message, 
  onProductSelect, 
  onInvoiceUpdate, 
  onInvoiceFinalize,
  onRefreshProducts 
}) => {
  const messageContent = message.content || message.text || '';
  const isUserMessage = message.isUser || message.sender === 'user';
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check if product data is incomplete and needs refresh
  useEffect(() => {
    if (message.type === 'product-selection' && message.products && message.products.length > 0) {
      const firstProduct = message.products[0];
      if (
        (!firstProduct.quantity && firstProduct.quantity !== 0) || 
        (!firstProduct.pagam_cliente && firstProduct.pagam_cliente !== 0) || 
        (!firstProduct.quota_gse && firstProduct.quota_gse !== 0)
      ) {
        // Data is incomplete, schedule a refresh
        const refreshTimer = setTimeout(() => {
          handleRefresh();
        }, 1500);
        
        return () => clearTimeout(refreshTimer);
      }
    }
  }, [message]);
  
  const handleRefresh = useCallback(() => {
    if (onRefreshProducts && message.queryId) {
      setIsRefreshing(true);
      onRefreshProducts(message.queryId).finally(() => {
        setIsRefreshing(false);
      });
    }
  }, [onRefreshProducts, message.queryId]);
  
  const renderSpecialContent = () => {
    try {
      if (message.type === 'product-selection') {
        return (
          <div className="relative">
            {isRefreshing && (
              <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Refreshing product data...</span>
                </div>
              </div>
            )}
            <ProductSelection
              products={message.products}
              selectedProducts={message.selectedProducts}
              onSelectionChange={(selectedProducts) => onProductSelect(selectedProducts, message.queryId)}
              isOffline={message.isOffline}
            />
          </div>
        );
      }
      
      if (message.type === 'invoice-preview') {
        return (
          <InlineInvoicePreview
            invoiceData={message.invoiceData}
            invoiceId={message.invoiceId}
            onUpdate={(updatedData) => {
              onInvoiceUpdate && onInvoiceUpdate(updatedData, message.draftId);
            }}
            onFinalize={(finalData) => {
              onInvoiceFinalize && onInvoiceFinalize(finalData, message.draftId);
            }}
            isOffline={message.isOffline}
          />
        );
      }

      if (message.type === 'final-invoice' || message.type === 'invoice-card') {
        return (
          <ExactHtmlInvoiceTemplate
            invoiceData={message.invoiceData}
            invoiceId={message.invoiceId}
            isOffline={message.isOffline}
          />
        );
      }

      if (message.type === 'updated-invoice' || message.type === 'invoice-card-edited') {
        return (
          <ProfessionalInvoiceWithNewChanges 
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
      return <div>Error rendering content</div>;
    }
  };

  const specialContent = renderSpecialContent();
  
  if (specialContent) {
    return (
      <div className="mb-4 w-full max-w-full">
        {specialContent}
      </div>
    );
  }

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUserMessage
            ? 'bg-green-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        <div className="text-sm md:text-base whitespace-pre-wrap break-words">
          {messageContent}
        </div>
        {message.timestamp && (
          <div
            className={`text-xs mt-2 ${
              isUserMessage ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {typeof message.timestamp === 'string' && message.timestamp.includes(':') 
              ? message.timestamp 
              : new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;