'use client';

import { useState } from 'react';
import ProductSelection from './ProductSelection';
import InlineInvoicePreview from './InlineInvoicePreview';

import ExactHtmlInvoiceTemplate from './ExactHtmlInvoiceTemplate';
import ProfessionalInvoiceWithNewChanges from './ProfessionalInvoiceWithNewChanges';

const MessageBubble = ({ message, onProductSelect, onInvoiceUpdate, onInvoiceFinalize }) => {
  // Handle different message property names for backward compatibility
  const messageContent = message.content || message.text || '';
  const isUserMessage = message.isUser || message.sender === 'user';
  
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
            invoiceId={message.invoiceId}
            onUpdate={(updatedData) => {
              console.log('Invoice update requested:', updatedData);
              onInvoiceUpdate && onInvoiceUpdate(updatedData, message.draftId);
            }}
            onFinalize={(finalData) => {
              console.log('Invoice finalize requested:', finalData);
              console.log('Using draftId:', message.draftId);
              onInvoiceFinalize && onInvoiceFinalize(finalData, message.draftId);
            }}
            isOffline={message.isOffline}
          />
        );
      }

      if (message.type === 'final-invoice' || message.type === 'invoice-card') {
        return (
          // <ProfessionalInvoice 
          //   invoiceData={message.invoiceData} 
          //   invoiceId={message.invoiceId}
          //   isOffline={message.isOffline}
          // />

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
      <div className="mb-4">
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
