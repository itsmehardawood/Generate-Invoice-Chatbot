// Enhanced version with print preview and change highlighting

"use client";

import React, { useState, useEffect } from 'react';

const ProfessionalInvoiceWithNewChanges = ({
  invoiceData,
  previousVersionData,
  originalInvoiceData,
  invoiceId,
  isOffline = false,
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString("it-IT");
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return new Date().toLocaleDateString("it-IT");
      return date.toLocaleDateString("it-IT");
    } catch (error) {
      console.error("Date formatting error:", error);
      return new Date().toLocaleDateString("it-IT");
    }
  };

  // Handle the updated invoice data structure from edit_invoice endpoint
  const data = invoiceData?.updated_invoice_data || invoiceData?.data || invoiceData || {
    recipient: "AZZURRA S.R.L - HOTEL EXECUTIVE",
    status: "pending",
    created_at: new Date().toISOString(),
    total_amount: 135000.0,
    subtotal: 193649.73,
    conto_termico_discount: 58649.73,
    credito_imposta: 87142.38,
    quota_cliente: 47857.62,
    building_site: {
      address: "",
      city: "BRINDISI",
      postal_code: "",
      country: "Italia",
    },
    products: [
      {
        product_id: 1,
        codice: "MIS5.0",
        tipo: "Software Gestionale",
        descrizione_titolo: "Misuratore di energia elettrica",
        descrizione:
          "Offerta per fornitura e posa in opera di Misuratore di energia elettrica con sistema integrato di IA software e hardware composto da controllore e morsetti alimentato a 24V per la gestione e il controllo del sistema impianto.",
        quantity: 1,
        udm: "Nr",
        unit_price: 5000.0,
        total_price: 5000.0,
        incentivi: 1500.0,
        quota_cliente: 3500.0,
      },
    ],
  };

  // Use the original invoice data as the "previous" data to compare against
  const previousData = originalInvoiceData?.data || originalInvoiceData || {};
  const originalData = originalInvoiceData?.data || originalInvoiceData || {};

  // Helper function to check if a value has changed between current and original version
  const hasNewChange = (currentVal, originalVal) => {
    return JSON.stringify(currentVal) !== JSON.stringify(originalVal);
  };

  // Helper function to render highlighted text for changes only
  const renderWithNewChangeHighlight = (currentVal, originalVal, className = "") => {
    const isChanged = hasNewChange(currentVal, originalVal);
    
    // Only highlight in yellow if this value is different from the original
    if (isChanged) {
      return (
        <span className={`${className} bg-yellow-200 px-1 rounded`}>
          {currentVal}
        </span>
      );
    }
    
    // Return normal content without highlighting
    return <span className={className}>{currentVal}</span>;
  };

  // Function to generate dynamic product table rows with change highlighting
  const generateProductRows = () => {
    return (
      data.products
        ?.map(
          (item, index) => {
            const previousItem = previousData.products?.[index] || {};
            const originalItem = originalData.products?.[index] || {};
            
            return `
      <tr style="height: 142pt">
        <td
          style="
            color: black;
            width: 54pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 2pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.codice || item.P_code, originalItem.codice || originalItem.P_code) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 13pt; text-indent: 0pt; text-align: left"
          >
            ${item.codice || item.P_code || ""}
          </p>
        </td>
        <td
          style="
            color: black;
            width: 222pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.tipo || item.name, originalItem.tipo || originalItem.name) || hasNewChange(item.descrizione || item.description || item.descrizione_titolo, originalItem.descrizione || originalItem.description || originalItem.descrizione_titolo) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p
            class="s7"
            style="
              padding-top: 6pt;
              padding-left: 65pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            ${item.tipo || item.name || ""}
          </p>
          <p
            class="s9"
            style="
              color: black;
              padding-top: 8pt;
              padding-left: 2pt;
              padding-right: 1pt;
              text-indent: 0pt;
              line-height: 109%;
              text-align: left;
            "
          >
            ${
              item.descrizione ||
              item.description ||
              item.descrizione_titolo ||
              ""
            }
          </p>
        </td>
        <td
          style="
            color: black;
            width: 31pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.quantity, originalItem.quantity) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 13pt; text-indent: 0pt; text-align: left"
          >
            ${item.quantity || 1}
          </p>
        </td>
        <td
          style="
            color: black;
            width: 23pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.udm, originalItem.udm) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 7pt; text-indent: 0pt; text-align: left"
          >
            ${item.udm || "Nr"}
          </p>
        </td>
        <td
          style="
            color: black;
            width: 46pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.unit_price, originalItem.unit_price) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 7pt; text-indent: 0pt; text-align: left"
          >
            ${(item.unit_price || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
        <td
          style="
            width: 46pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.total_price || item.totale, originalItem.total_price || originalItem.totale) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 5pt; text-indent: 0pt; text-align: left"
          >
            ${(item.total_price || item.totale || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
        <td
          style="
            width: 62pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(item.incentivi || item.quota_gse, originalItem.incentivi || originalItem.quota_gse) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 13pt; text-indent: 0pt; text-align: left"
          >
            ${(item.incentivi || item.quota_gse || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
        <td
          style="
            width: 61pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 2pt;
            ${hasNewChange(item.quota_cliente || item.pagam_cliente, originalItem.quota_cliente || originalItem.pagam_cliente) ? 'background-color: #fff3cd;' : ''}
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-left: 13pt; text-indent: 0pt; text-align: left"
          >
            ${(item.quota_cliente || item.pagam_cliente || 0).toLocaleString(
              "it-IT",
              { minimumFractionDigits: 2 }
            )} €
          </p>
        </td>
      </tr>
    `;
          }
        )
        .join("") || ""
    );
  };

  // Function to generate the summary table with dynamic data and change highlighting
  const generateSummaryTable = () => {
    return `
      <tr style="height: 41pt">
        <td
          style="
            width: 422pt;
            color: black;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 2pt;
            border-bottom-style: solid;
            border-bottom-width: 2pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(data.subtotal, originalData.subtotal) ? 'background-color: #fff3cd;' : ''}
          "
          colspan="2"
          rowspan="2"
          bgcolor="#F2F2F2"
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s8"
            style="padding-right: 1pt; text-indent: 0pt; text-align: right"
          >
            ${(data.subtotal || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
        <td
          style="
            width: 62pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-bottom-color: #a5a5a5;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(data.credito_imposta, originalData.credito_imposta) ? 'background-color: #fff3cd;' : ''}
          "
          bgcolor="#F2F2F2"
        >
          <p
            class="s12"
            style="
              padding-top: 3pt;
              padding-left: 14pt;
              padding-right: 13pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          >
            CREDITO IMPOSTA
          </p>
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s11"
            style="padding-left: 12pt; text-indent: 0pt; text-align: left"
          >
            ${(data.credito_imposta || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
        <td
          style="
            width: 61pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 2pt;
            ${hasNewChange(data.quota_cliente, originalData.quota_cliente) ? 'background-color: #fff3cd;' : ''}
          "
          bgcolor="#F2F2F2"
        >
          <p
            class="s12"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: center;
            "
          >
            QUOTA CLIENTE
          </p>
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s11"
            style="padding-left: 12pt; text-indent: 0pt; text-align: left"
          >
            ${(data.quota_cliente || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
      </tr>
      <tr style="height: 40pt">
        <td
          style="
            width: 62pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-top-color: #a5a5a5;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 2pt;
            border-right-style: solid;
            border-right-width: 1pt;
            ${hasNewChange(data.conto_termico_discount, originalData.conto_termico_discount) ? 'background-color: #fff3cd;' : ''}
          "
          bgcolor="#F2F2F2"
        >
          <p
            class="s12"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: center;
            "
          >
            CONTO TERMICO
          </p>
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s11"
            style="padding-left: 2pt; text-indent: 0pt; text-align: center"
          >
            ${(data.conto_termico_discount || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
        <td
          style="
            width: 61pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 2pt;
            border-right-style: solid;
            border-right-width: 2pt;
            ${hasNewChange(data.total_amount, originalData.total_amount) ? 'background-color: #fff3cd;' : ''}
          "
          bgcolor="#F2F2F2"
        >
          <p
            class="s12"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: center;
            "
          >
            COSTO
          </p>
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s11"
            style="padding-left: 2pt; text-indent: 0pt; text-align: center"
          >
            ${(data.total_amount || 0).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })} €
          </p>
        </td>
      </tr>
    `;
  };

  const generateProcessedHtmlContent = async () => {
    setLoading(true);
    try {
      // Load the original HTML template
      const response = await fetch("/invoice_template.html", {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let htmlContent = await response.text();

      if (!htmlContent || htmlContent.length < 100) {
        throw new Error("Invalid or empty HTML template");
      }

      // Replace recipient/client name with change highlighting
      const currentRecipient = data.recipient || "AZZURRA S.R.L - HOTEL EXECUTIVE";
      const originalRecipient = originalData.recipient || "AZZURRA S.R.L - HOTEL EXECUTIVE";
      const recipientStyle = hasNewChange(currentRecipient, originalRecipient) ? 'background-color: #fff3cd;' : '';
      
      htmlContent = htmlContent.replace(
        /AZZURRA S\.R\.L - HOTEL EXECUTIVE/g,
        `<span style="${recipientStyle}">${currentRecipient}</span>`
      );

      // Replace address with change highlighting
      const addressParts = [
        data.building_site?.address || data.building_site?.Address,
        data.building_site?.postal_code || data.building_site?.Postal,
        data.building_site?.city || data.building_site?.City,
        data.building_site?.country || data.building_site?.Country
      ].filter(Boolean);
      
      const originalAddressParts = [
        originalData.building_site?.address || originalData.building_site?.Address,
        originalData.building_site?.postal_code || originalData.building_site?.Postal,
        originalData.building_site?.city || originalData.building_site?.City,
        originalData.building_site?.country || originalData.building_site?.Country
      ].filter(Boolean);
      
      const currentAddress = addressParts.join(", ") || "BRINDISI";
      const originalAddress = originalAddressParts.join(", ") || "BRINDISI";
      const addressStyle = hasNewChange(currentAddress, originalAddress) ? 'background-color: #fff3cd;' : '';

      htmlContent = htmlContent.replace(
        /<h3[^>]*>\s*BRINDISI\s*<\/h3>/,
        `<h3 style="padding-top: 7pt; padding-left: 14pt; text-indent: 0pt; text-align: left; ${addressStyle}">
          ${currentAddress}
        </h3>`
      );

      // Replace date with change highlighting
      const currentDate = formatDate(data.created_at);
      const originalDate = formatDate(originalData.created_at);
      const dateStyle = hasNewChange(currentDate, originalDate) ? 'background-color: #fff3cd;' : '';
      
      htmlContent = htmlContent.replace(
        /<span style="color: #1d5054">28\/05\/2025<\/span>/g,
        `<span style="color: #1d5054; ${dateStyle}">${currentDate}</span>`
      );

      // Replace destination city with change highlighting
      const currentCity = data.building_site?.city || data.building_site?.City || 'BRINDISI';
      const originalCity = originalData.building_site?.city || originalData.building_site?.City || 'BRINDISI';
      const cityStyle = hasNewChange(currentCity, originalCity) ? 'background-color: #fff3cd;' : '';
      
      htmlContent = htmlContent.replace(
        /<h3 style="text-indent: 0pt; text-align: left">BRINDISI<\/h3>/,
        `<h3 style="text-indent: 0pt; padding-left: 18pt; text-align: left; ${cityStyle}">
          ${currentCity}
        </h3>`
      );

      // Replace destination address with change highlighting
      const currentDestAddress = data.building_site?.address || '';
      const originalDestAddress = originalData.building_site?.address || '';
      const destAddressStyle = hasNewChange(currentDestAddress, originalDestAddress) ? 'background-color: #fff3cd;' : '';
      
      htmlContent = htmlContent.replace(
        /<h4[^>]*>VIA POZZO TRAIANO,24<\/h4>/g,
        `<h4 style="padding-top: 5pt; padding-left: 14pt; text-indent: 0pt; text-align: left; ${destAddressStyle}">${currentDestAddress}</h4>`
      );

      // Replace invoice number with change highlighting
      const invoiceNumber = invoiceId || "456a/2025";
      const invoiceStyle = hasNewChange(invoiceNumber, originalData.invoiceId || "456a/2025") ? 'background-color: #fff3cd;' : '';
      
      htmlContent = htmlContent.replace(
        /<span style="color: #1d5054">456a\/2025<\/span>/g,
        `<span style="color: #1d5054; ${invoiceStyle}">${invoiceNumber}</span>`
      );

      // Replace revision number and author if available with change highlighting
      if (data.revision_number || data.author) {
        const currentRevision = data.revision_number || '8';
        const currentAuthor = data.author || 'GABRIELE';
        const originalRevision = originalData.revision_number || '8';
        const originalAuthor = originalData.author || 'GABRIELE';
        
        const revisionStyle = hasNewChange(currentRevision, originalRevision) ? 'background-color: #fff3cd;' : '';
        const authorStyle = hasNewChange(currentAuthor, originalAuthor) ? 'background-color: #fff3cd;' : '';
        
        htmlContent = htmlContent.replace(
          /<span style="color: #1d5054">8 <\/span>Da:\s*<span style="color: #1d5054">GABRIELE<\/span>/,
          `<span style="color: #1d5054; ${revisionStyle}">${currentRevision} </span>Da: <span style="color: #1d5054; ${authorStyle}">${currentAuthor}</span>`
        );
      }

      // Financial Summary with change highlighting
      const currentSubtotal = data.subtotal || 193649.73;
      const originalSubtotal = originalData.subtotal || 193649.73;
      const subtotalStyle = hasNewChange(currentSubtotal, originalSubtotal) ? 'style="background-color: #fff3cd;"' : '';
      
      htmlContent = htmlContent.replace(
        /193\.649,73 €/g,
        `<span ${subtotalStyle}>${currentSubtotal.toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €</span>`
      );

      const currentContoTermico = data.conto_termico_discount || 58649.73;
      const originalContoTermico = originalData.conto_termico_discount || 58649.73;
      const contoTermicoStyle = hasNewChange(currentContoTermico, originalContoTermico) ? 'style="background-color: #fff3cd;"' : '';
      
      htmlContent = htmlContent.replace(
        /-58\.649,73 €/g,
        `<span ${contoTermicoStyle}>-${currentContoTermico.toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €</span>`
      );

      const currentTotal = data.total_amount || 135000.0;
      const originalTotal = originalData.total_amount || 135000.0;
      const totalStyle = hasNewChange(currentTotal, originalTotal) ? 'style="background-color: #fff3cd;"' : '';
      
      htmlContent = htmlContent.replace(
        /135\.000,00 €/g,
        `<span ${totalStyle}>${currentTotal.toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €</span>`
      );

      const currentCredito = data.credito_imposta || 87142.38;
      const originalCredito = originalData.credito_imposta || 87142.38;
      const creditoStyle = hasNewChange(currentCredito, originalCredito) ? 'style="background-color: #fff3cd;"' : '';
      
      htmlContent = htmlContent.replace(
        /-87\.142,38 €/g,
        `<span ${creditoStyle}>-${currentCredito.toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €</span>`
      );

      // Replace product table
      const productTableStart = htmlContent.indexOf('<tr style="height: 142pt">');
      const productTableEnd = htmlContent.indexOf("</table>", productTableStart);

      if (productTableStart !== -1 && productTableEnd !== -1) {
        const beforeTable = htmlContent.substring(0, productTableStart);
        const afterTable = htmlContent.substring(productTableEnd);
        htmlContent = beforeTable + generateProductRows() + afterTable;
      }

      // Replace summary table
      const summaryTableStart = htmlContent.indexOf('<tr style="height: 41pt">');
      const summaryTableEnd = htmlContent.indexOf("</tr>", htmlContent.indexOf("</tr>", summaryTableStart) + 5) + 5;

      if (summaryTableStart !== -1 && summaryTableEnd !== -1) {
        const beforeSummary = htmlContent.substring(0, summaryTableStart);
        const afterSummary = htmlContent.substring(summaryTableEnd);
        htmlContent = beforeSummary + generateSummaryTable() + afterSummary;
      }

      setHtmlContent(htmlContent);
    } catch (error) {
      console.error("Error loading HTML template:", error);
      setHtmlContent('<p style="color: red; text-align: center; padding: 20px;">Error loading template. Please make sure the HTML file is accessible.</p>');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!htmlContent) {
      generateProcessedHtmlContent();
    }
  }, []);
  const handlePrint = async () => {
    await generateProcessedHtmlContent();
    
    if (!htmlContent) {
      alert("Could not load the template for printing.");
      return;
    }

    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768;

      if (isMobile) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        const printWindow = window.open(blobUrl, '_blank');
        
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            }, 1000);
          };
        } else {
          const directWindow = window.open("", "_blank", "width=800,height=600");
          directWindow.document.write(htmlContent);
          directWindow.document.close();
          setTimeout(() => directWindow.print(), 500);
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }

    } catch (error) {
      console.error("Error printing:", error);
      alert("Could not print the document. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      <div
        className="print-content bg-white relative"
        style={{ minHeight: "8.7cm", fontFamily: "Arial, sans-serif" }}
      >
        {/* Main content area */}
        <div className="print-main-content">
          {/* Exact HTML Template Preview */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Caricamento anteprima...</div>
              </div>
            ) : (
              <div className="w-full bg-gray-50 p-4">
                <div className="w-full bg-white rounded shadow-sm border border-gray-200">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full border-0"
                    style={{ 
                      height: '600px',
                      minHeight: '500px'
                    }}
                    title="Invoice Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="print-hide flex flex-col sm:flex-row justify-center mt-6 lg:mt-8 gap-3 lg:gap-4 bg-gray-100 p-4">
        <button
          onClick={handlePrint}
          className="px-4 lg:px-6 py-2 lg:py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm lg:text-base w-full sm:w-auto active:scale-95"
        >
          Stampa Preventivo con Modifiche
        </button>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body,
          html {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          body * {
            visibility: hidden;
          }

          .print-content,
          .print-content * {
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

export default ProfessionalInvoiceWithNewChanges;











// "use client";

// import React, { useState, useEffect, useRef } from 'react';

// const ProfessionalInvoiceWithNewChanges = ({
//   invoiceData,
//   previousVersionData,
//   originalInvoiceData,
//   invoiceId,
//   isOffline = false,
// }) => {
//   const [htmlContent, setHtmlContent] = useState('');
//   const [editableContent, setEditableContent] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const iframeRef = useRef(null);

//   const formatDate = (dateString) => {
//     if (!dateString) return new Date().toLocaleDateString("it-IT");
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return new Date().toLocaleDateString("it-IT");
//       return date.toLocaleDateString("it-IT");
//     } catch (error) {
//       console.error("Date formatting error:", error);
//       return new Date().toLocaleDateString("it-IT");
//     }
//   };

//   // Handle the updated invoice data structure from edit_invoice endpoint
//   const data = invoiceData?.updated_invoice_data || invoiceData?.data || invoiceData || {
//     recipient: "AZZURRA S.R.L - HOTEL EXECUTIVE",
//     status: "pending",
//     created_at: new Date().toISOString(),
//     total_amount: 135000.0,
//     subtotal: 193649.73,
//     conto_termico_discount: 58649.73,
//     credito_imposta: 87142.38,
//     quota_cliente: 47857.62,
//     building_site: {
//       address: "",
//       city: "BRINDISI",
//       postal_code: "",
//       country: "Italia",
//     },
//     products: [
//       {
//         product_id: 1,
//         codice: "MIS5.0",
//         tipo: "Software Gestionale",
//         descrizione_titolo: "Misuratore di energia elettrica",
//         descrizione:
//           "Offerta per fornitura e posa in opera di Misuratore di energia elettrica con sistema integrato di IA software e hardware composto da controllore e morsetti alimentato a 24V per la gestione e il controllo del sistema impianto.",
//         quantity: 1,
//         udm: "Nr",
//         unit_price: 5000.0,
//         total_price: 5000.0,
//         incentivi: 1500.0,
//         quota_cliente: 3500.0,
//       },
//     ],
//   };

//   // Use the original invoice data as the "previous" data to compare against
//   const previousData = originalInvoiceData?.data || originalInvoiceData || {};
//   const originalData = originalInvoiceData?.data || originalInvoiceData || {};

//   // Helper function to check if a value has changed between current and original version
//   const hasNewChange = (currentVal, originalVal) => {
//     return JSON.stringify(currentVal) !== JSON.stringify(originalVal);
//   };

//   // Function to generate dynamic product table rows with change highlighting
//   const generateProductRows = () => {
//     return (
//       data.products
//         ?.map(
//           (item, index) => {
//             const previousItem = previousData.products?.[index] || {};
//             const originalItem = originalData.products?.[index] || {};
            
//             return `
//       <tr style="height: 142pt">
//         <td
//           style="
//             color: black;
//             width: 54pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 2pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.codice || item.P_code, originalItem.codice || originalItem.P_code) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 13pt; text-indent: 0pt; text-align: left"
//           >
//             ${item.codice || item.P_code || ""}
//           </p>
//         </td>
//         <td
//           style="
//             color: black;
//             width: 222pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.tipo || item.name, originalItem.tipo || originalItem.name) || hasNewChange(item.descrizione || item.description || item.descrizione_titolo, originalItem.descrizione || originalItem.description || originalItem.descrizione_titolo) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p
//             class="s7"
//             style="
//               padding-top: 6pt;
//               padding-left: 65pt;
//               text-indent: 0pt;
//               text-align: left;
//             "
//           >
//             ${item.tipo || item.name || ""}
//           </p>
//           <p
//             class="s9"
//             style="
//               color: black;
//               padding-top: 8pt;
//               padding-left: 2pt;
//               padding-right: 1pt;
//               text-indent: 0pt;
//               line-height: 109%;
//               text-align: left;
//             "
//           >
//             ${
//               item.descrizione ||
//               item.description ||
//               item.descrizione_titolo ||
//               ""
//             }
//           </p>
//         </td>
//         <td
//           style="
//             color: black;
//             width: 31pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.quantity, originalItem.quantity) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 13pt; text-indent: 0pt; text-align: left"
//           >
//             ${item.quantity || 1}
//           </p>
//         </td>
//         <td
//           style="
//             color: black;
//             width: 23pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.udm, originalItem.udm) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 7pt; text-indent: 0pt; text-align: left"
//           >
//             ${item.udm || "Nr"}
//           </p>
//         </td>
//         <td
//           style="
//             color: black;
//             width: 46pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.unit_price, originalItem.unit_price) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 7pt; text-indent: 0pt; text-align: left"
//           >
//             ${(item.unit_price || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//         <td
//           style="
//             width: 46pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.total_price || item.totale, originalItem.total_price || originalItem.totale) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 5pt; text-indent: 0pt; text-align: left"
//           >
//             ${(item.total_price || item.totale || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//         <td
//           style="
//             width: 62pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(item.incentivi || item.quota_gse, originalItem.incentivi || originalItem.quota_gse) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 13pt; text-indent: 0pt; text-align: left"
//           >
//             ${(item.incentivi || item.quota_gse || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//         <td
//           style="
//             width: 61pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 2pt;
//             ${hasNewChange(item.quota_cliente || item.pagam_cliente, originalItem.quota_cliente || originalItem.pagam_cliente) ? 'background-color: #fff3cd;' : ''}
//           "
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-left: 13pt; text-indent: 0pt; text-align: left"
//           >
//             ${(item.quota_cliente || item.pagam_cliente || 0).toLocaleString(
//               "it-IT",
//               { minimumFractionDigits: 2 }
//             )} €
//           </p>
//         </td>
//       </tr>
//     `;
//           }
//         )
//         .join("") || ""
//     );
//   };

//   // Function to generate the summary table with dynamic data and change highlighting
//   const generateSummaryTable = () => {
//     return `
//       <tr style="height: 41pt">
//         <td
//           style="
//             width: 422pt;
//             color: black;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 2pt;
//             border-bottom-style: solid;
//             border-bottom-width: 2pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(data.subtotal, originalData.subtotal) ? 'background-color: #fff3cd;' : ''}
//           "
//           colspan="2"
//           rowspan="2"
//           bgcolor="#F2F2F2"
//         >
//           <p style="text-indent: 0pt; text-align: left"><br /></p>
//           <p
//             class="s8"
//             style="padding-right: 1pt; text-indent: 0pt; text-align: right"
//           >
//             ${(data.subtotal || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//         <td
//           style="
//             width: 62pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-bottom-color: #a5a5a5;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(data.credito_imposta, originalData.credito_imposta) ? 'background-color: #fff3cd;' : ''}
//           "
//           bgcolor="#F2F2F2"
//         >
//           <p
//             class="s12"
//             style="
//               padding-top: 3pt;
//               padding-left: 14pt;
//               padding-right: 13pt;
//               text-indent: 0pt;
//               line-height: 112%;
//               text-align: left;
//             "
//           >
//             CREDITO IMPOSTA
//           </p>
//           <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
//             <br />
//           </p>
//           <p
//             class="s11"
//             style="padding-left: 12pt; text-indent: 0pt; text-align: left"
//           >
//             ${(data.credito_imposta || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//         <td
//           style="
//             width: 61pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 1pt;
//             border-right-style: solid;
//             border-right-width: 2pt;
//             ${hasNewChange(data.quota_cliente, originalData.quota_cliente) ? 'background-color: #fff3cd;' : ''}
//           "
//           bgcolor="#F2F2F2"
//         >
//           <p
//             class="s12"
//             style="
//               padding-top: 3pt;
//               padding-left: 2pt;
//               text-indent: 0pt;
//               text-align: center;
//             "
//           >
//             QUOTA CLIENTE
//           </p>
//           <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
//             <br />
//           </p>
//           <p
//             class="s11"
//             style="padding-left: 12pt; text-indent: 0pt; text-align: left"
//           >
//             ${(data.quota_cliente || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//       </tr>
//       <tr style="height: 40pt">
//         <td
//           style="
//             width: 62pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-top-color: #a5a5a5;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 2pt;
//             border-right-style: solid;
//             border-right-width: 1pt;
//             ${hasNewChange(data.conto_termico_discount, originalData.conto_termico_discount) ? 'background-color: #fff3cd;' : ''}
//           "
//           bgcolor="#F2F2F2"
//         >
//           <p
//             class="s12"
//             style="
//               padding-top: 3pt;
//               padding-left: 2pt;
//               text-indent: 0pt;
//               text-align: center;
//             "
//           >
//             CONTO TERMICO
//           </p>
//           <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
//             <br />
//           </p>
//           <p
//             class="s11"
//             style="padding-left: 2pt; text-indent: 0pt; text-align: center"
//           >
//             ${(data.conto_termico_discount || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//         <td
//           style="
//             width: 61pt;
//             border-top-style: solid;
//             border-top-width: 1pt;
//             border-left-style: solid;
//             border-left-width: 1pt;
//             border-bottom-style: solid;
//             border-bottom-width: 2pt;
//             border-right-style: solid;
//             border-right-width: 2pt;
//             ${hasNewChange(data.total_amount, originalData.total_amount) ? 'background-color: #fff3cd;' : ''}
//           "
//           bgcolor="#F2F2F2"
//         >
//           <p
//             class="s12"
//             style="
//               padding-top: 3pt;
//               padding-left: 2pt;
//               text-indent: 0pt;
//               text-align: center;
//             "
//           >
//             COSTO
//           </p>
//           <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
//             <br />
//           </p>
//           <p
//             class="s11"
//             style="padding-left: 2pt; text-indent: 0pt; text-align: center"
//           >
//             ${(data.total_amount || 0).toLocaleString("it-IT", {
//               minimumFractionDigits: 2,
//             })} €
//           </p>
//         </td>
//       </tr>
//     `;
//   };

//   const generateProcessedHtmlContent = async () => {
//     setLoading(true);
//     try {
//       // Load the original HTML template
//       const response = await fetch("/invoice_template.html", {
//         method: 'GET',
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       let htmlContent = await response.text();

//       if (!htmlContent || htmlContent.length < 100) {
//         throw new Error("Invalid or empty HTML template");
//       }

//       // Replace recipient/client name with change highlighting
//       const currentRecipient = data.recipient || "AZZURRA S.R.L - HOTEL EXECUTIVE";
//       const originalRecipient = originalData.recipient || "AZZURRA S.R.L - HOTEL EXECUTIVE";
//       const recipientStyle = hasNewChange(currentRecipient, originalRecipient) ? 'background-color: #fff3cd;' : '';
      
//       htmlContent = htmlContent.replace(
//         /AZZURRA S\.R\.L - HOTEL EXECUTIVE/g,
//         `<span style="${recipientStyle}">${currentRecipient}</span>`
//       );

//       // Replace address with change highlighting
//       const addressParts = [
//         data.building_site?.address || data.building_site?.Address,
//         data.building_site?.postal_code || data.building_site?.Postal,
//         data.building_site?.city || data.building_site?.City,
//         data.building_site?.country || data.building_site?.Country
//       ].filter(Boolean);
      
//       const originalAddressParts = [
//         originalData.building_site?.address || originalData.building_site?.Address,
//         originalData.building_site?.postal_code || originalData.building_site?.Postal,
//         originalData.building_site?.city || originalData.building_site?.City,
//         originalData.building_site?.country || originalData.building_site?.Country
//       ].filter(Boolean);
      
//       const currentAddress = addressParts.join(", ") || "BRINDISI";
//       const originalAddress = originalAddressParts.join(", ") || "BRINDISI";
//       const addressStyle = hasNewChange(currentAddress, originalAddress) ? 'background-color: #fff3cd;' : '';

//       htmlContent = htmlContent.replace(
//         /<h3[^>]*>\s*BRINDISI\s*<\/h3>/,
//         `<h3 style="padding-top: 7pt; padding-left: 14pt; text-indent: 0pt; text-align: left; ${addressStyle}">
//           ${currentAddress}
//         </h3>`
//       );

//       // Replace date with change highlighting
//       const currentDate = formatDate(data.created_at);
//       const originalDate = formatDate(originalData.created_at);
//       const dateStyle = hasNewChange(currentDate, originalDate) ? 'background-color: #fff3cd;' : '';
      
//       htmlContent = htmlContent.replace(
//         /<span style="color: #1d5054">28\/05\/2025<\/span>/g,
//         `<span style="color: #1d5054; ${dateStyle}">${currentDate}</span>`
//       );

//       // Replace destination city with change highlighting
//       const currentCity = data.building_site?.city || data.building_site?.City || 'BRINDISI';
//       const originalCity = originalData.building_site?.city || originalData.building_site?.City || 'BRINDISI';
//       const cityStyle = hasNewChange(currentCity, originalCity) ? 'background-color: #fff3cd;' : '';
      
//       htmlContent = htmlContent.replace(
//         /<h3 style="text-indent: 0pt; text-align: left">BRINDISI<\/h3>/,
//         `<h3 style="text-indent: 0pt; padding-left: 18pt; text-align: left; ${cityStyle}">
//           ${currentCity}
//         </h3>`
//       );

//       // Replace destination address with change highlighting
//       const currentDestAddress = data.building_site?.address || '';
//       const originalDestAddress = originalData.building_site?.address || '';
//       const destAddressStyle = hasNewChange(currentDestAddress, originalDestAddress) ? 'background-color: #fff3cd;' : '';
      
//       htmlContent = htmlContent.replace(
//         /<h4[^>]*>VIA POZZO TRAIANO,24<\/h4>/g,
//         `<h4 style="padding-top: 5pt; padding-left: 14pt; text-indent: 0pt; text-align: left; ${destAddressStyle}">${currentDestAddress}</h4>`
//       );

//       // Replace invoice number with change highlighting
//       const invoiceNumber = invoiceId || "456a/2025";
//       const invoiceStyle = hasNewChange(invoiceNumber, originalData.invoiceId || "456a/2025") ? 'background-color: #fff3cd;' : '';
      
//       htmlContent = htmlContent.replace(
//         /<span style="color: #1d5054">456a\/2025<\/span>/g,
//         `<span style="color: #1d5054; ${invoiceStyle}">${invoiceNumber}</span>`
//       );

//       // Replace revision number and author if available with change highlighting
//       if (data.revision_number || data.author) {
//         const currentRevision = data.revision_number || '8';
//         const currentAuthor = data.author || 'GABRIELE';
//         const originalRevision = originalData.revision_number || '8';
//         const originalAuthor = originalData.author || 'GABRIELE';
        
//         const revisionStyle = hasNewChange(currentRevision, originalRevision) ? 'background-color: #fff3cd;' : '';
//         const authorStyle = hasNewChange(currentAuthor, originalAuthor) ? 'background-color: #fff3cd;' : '';
        
//         htmlContent = htmlContent.replace(
//           /<span style="color: #1d5054">8 <\/span>Da:\s*<span style="color: #1d5054">GABRIELE<\/span>/,
//           `<span style="color: #1d5054; ${revisionStyle}">${currentRevision} </span>Da: <span style="color: #1d5054; ${authorStyle}">${currentAuthor}</span>`
//         );
//       }

//       // Financial Summary with change highlighting
//       const currentSubtotal = data.subtotal || 193649.73;
//       const originalSubtotal = originalData.subtotal || 193649.73;
//       const subtotalStyle = hasNewChange(currentSubtotal, originalSubtotal) ? 'style="background-color: #fff3cd;"' : '';
      
//       htmlContent = htmlContent.replace(
//         /193\.649,73 €/g,
//         `<span ${subtotalStyle}>${currentSubtotal.toLocaleString("it-IT", {
//           minimumFractionDigits: 2,
//         })} €</span>`
//       );

//       const currentContoTermico = data.conto_termico_discount || 58649.73;
//       const originalContoTermico = originalData.conto_termico_discount || 58649.73;
//       const contoTermicoStyle = hasNewChange(currentContoTermico, originalContoTermico) ? 'style="background-color: #fff3cd;"' : '';
      
//       htmlContent = htmlContent.replace(
//         /-58\.649,73 €/g,
//         `<span ${contoTermicoStyle}>-${currentContoTermico.toLocaleString("it-IT", {
//           minimumFractionDigits: 2,
//         })} €</span>`
//       );

//       const currentTotal = data.total_amount || 135000.0;
//       const originalTotal = originalData.total_amount || 135000.0;
//       const totalStyle = hasNewChange(currentTotal, originalTotal) ? 'style="background-color: #fff3cd;"' : '';
      
//       htmlContent = htmlContent.replace(
//         /135\.000,00 €/g,
//         `<span ${totalStyle}>${currentTotal.toLocaleString("it-IT", {
//           minimumFractionDigits: 2,
//         })} €</span>`
//       );

//       const currentCredito = data.credito_imposta || 87142.38;
//       const originalCredito = originalData.credito_imposta || 87142.38;
//       const creditoStyle = hasNewChange(currentCredito, originalCredito) ? 'style="background-color: #fff3cd;"' : '';
      
//       htmlContent = htmlContent.replace(
//         /-87\.142,38 €/g,
//         `<span ${creditoStyle}>-${currentCredito.toLocaleString("it-IT", {
//           minimumFractionDigits: 2,
//         })} €</span>`
//       );

//       // Replace product table
//       const productTableStart = htmlContent.indexOf('<tr style="height: 142pt">');
//       const productTableEnd = htmlContent.indexOf("</table>", productTableStart);

//       if (productTableStart !== -1 && productTableEnd !== -1) {
//         const beforeTable = htmlContent.substring(0, productTableStart);
//         const afterTable = htmlContent.substring(productTableEnd);
//         htmlContent = beforeTable + generateProductRows() + afterTable;
//       }

//       // Replace summary table
//       const summaryTableStart = htmlContent.indexOf('<tr style="height: 41pt">');
//       const summaryTableEnd = htmlContent.indexOf("</tr>", htmlContent.indexOf("</tr>", summaryTableStart) + 5) + 5;

//       if (summaryTableStart !== -1 && summaryTableEnd !== -1) {
//         const beforeSummary = htmlContent.substring(0, summaryTableStart);
//         const afterSummary = htmlContent.substring(summaryTableEnd);
//         htmlContent = beforeSummary + generateSummaryTable() + afterSummary;
//       }

//       setHtmlContent(htmlContent);
//       setEditableContent(htmlContent);
//     } catch (error) {
//       console.error("Error loading HTML template:", error);
//       setHtmlContent('<p style="color: red; text-align: center; padding: 20px;">Error loading template. Please make sure the HTML file is accessible.</p>');
//       setEditableContent('<p style="color: red; text-align: center; padding: 20px;">Error loading template. Please make sure the HTML file is accessible.</p>');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!htmlContent) {
//       generateProcessedHtmlContent();
//     }
//   }, []);

//   const enableEditing = () => {
//     setIsEditing(true);
    
//     // Wait for iframe to load then make content editable
//     const iframe = iframeRef.current;
//     if (iframe) {
//       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
//       // Make all text elements editable
//       const textElements = iframeDoc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, td');
//       textElements.forEach(el => {
//         el.contentEditable = true;
//         el.style.outline = 'none';
        
//         // Add debounced event listener to avoid frequent updates
//         let timeoutId;
//         el.addEventListener('input', () => {
//           clearTimeout(timeoutId);
//           timeoutId = setTimeout(handleContentChange, 500); // Debounce for 500ms
//         });
//         el.addEventListener('blur', handleContentChange);
//       });
//     }
//   };

//   const disableEditing = () => {
//     setIsEditing(false);
    
//     const iframe = iframeRef.current;
//     if (iframe) {
//       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
//       // Make all elements non-editable
//       const textElements = iframeDoc.querySelectorAll('[contenteditable="true"]');
//       textElements.forEach(el => {
//         el.contentEditable = false;
//         // Note: Event listeners will be automatically removed when iframe reloads
//       });
      
//       // Save final content
//       handleContentChange();
//     }
//   };

//   const handleContentChange = () => {
//     const iframe = iframeRef.current;
//     if (iframe) {
//       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//       const updatedContent = iframeDoc.documentElement.outerHTML;
//       setEditableContent(updatedContent);
//     }
//   };

//   const handlePrint = async () => {
//     // Use the edited content if available, otherwise generate the original
//     const contentToPrint = editableContent || htmlContent;
    
//     if (!contentToPrint) {
//       alert("Could not load the template for printing.");
//       return;
//     }

//     try {
//       const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
//                      window.innerWidth <= 768;

//       if (isMobile) {
//         const blob = new Blob([contentToPrint], { type: 'text/html' });
//         const blobUrl = URL.createObjectURL(blob);
        
//         const printWindow = window.open(blobUrl, '_blank');
        
//         if (printWindow) {
//           printWindow.onload = () => {
//             setTimeout(() => {
//               printWindow.print();
//               setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
//             }, 1000);
//           };
//         } else {
//           const directWindow = window.open("", "_blank", "width=800,height=600");
//           directWindow.document.write(contentToPrint);
//           directWindow.document.close();
//           setTimeout(() => directWindow.print(), 500);
//           URL.revokeObjectURL(blobUrl);
//         }
//       } else {
//         const printWindow = window.open("", "_blank", "width=800,height=600");
//         printWindow.document.write(contentToPrint);
//         printWindow.document.close();
//         printWindow.focus();
//         setTimeout(() => printWindow.print(), 500);
//       }

//     } catch (error) {
//       console.error("Error printing:", error);
//       alert("Could not print the document. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
//       <div
//         className="print-content bg-white relative"
//         style={{ minHeight: "8.7cm", fontFamily: "Arial, sans-serif" }}
//       >
//         {/* Main content area */}
//         <div className="print-main-content">
//           {/* Exact HTML Template Preview */}
//           <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="text-lg text-gray-600">Caricamento anteprima...</div>
//               </div>
//             ) : (
//               <div className="w-full bg-gray-50 p-4">
//                 <div className="w-full bg-white rounded shadow-sm border border-gray-200 relative">
//                   {isEditing && (
//                     <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white px-3 py-1 rounded text-sm">
//                       Modalità modifica
//                     </div>
//                   )}
//                   <iframe
//                     ref={iframeRef}
//                     srcDoc={editableContent || htmlContent}
//                     className="w-full border-0"
//                     style={{ 
//                       height: '600px',
//                       minHeight: '500px'
//                     }}
//                     title="Invoice Preview"
//                     sandbox="allow-same-origin"
//                     onLoad={() => {
//                       if (isEditing) {
//                         enableEditing();
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="print-hide flex flex-col sm:flex-row justify-center mt-6 lg:mt-8 gap-3 lg:gap-4 bg-gray-100 p-4">
//         <button
//           onClick={isEditing ? disableEditing : enableEditing}
//           className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base w-full sm:w-auto active:scale-95 ${
//             isEditing 
//               ? 'bg-gray-500 text-white hover:bg-gray-600' 
//               : 'bg-blue-500 text-white hover:bg-blue-600'
//           }`}
//         >
//           {isEditing ? 'Disattiva Modifica' : 'Modifica Anteprima'}
//         </button>
        
//         <button
//           onClick={handlePrint}
//           className="px-4 lg:px-6 py-2 lg:py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm lg:text-base w-full sm:w-auto active:scale-95"
//         >
//           Stampa Preventivo {isEditing ? 'Modificato' : 'con Modifiche'}
//         </button>
//       </div>

//       {/* Print styles */}
//       <style jsx>{`
//         @media print {
//           @page {
//             size: A4;
//             margin: 0;
//           }

//           body,
//           html {
//             height: 100%;
//             margin: 0;
//             padding: 0;
//           }

//           body * {
//             visibility: hidden;
//           }

//           .print-content,
//           .print-content * {
//             visibility: visible;
//           }

//           .print-content {
//             position: relative;
//             width: 100%;
//             background: white !important;
//             height: auto;
//             min-height: 29.7cm;
//           }

//           /* Fixed header for printing */
//           .print-header {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             height: 96px;
//             background-color: #086d32 !important;
//             -webkit-print-color-adjust: exact;
//             color-adjust: exact;
//             z-index: 1000;
//           }

//           /* Fixed footer for printing */
//           .print-footer {
//             position: fixed;
//             bottom: 0;
//             left: 0;
//             right: 0;
//             height: 96px;
//             background-color: #086d32 !important;
//             -webkit-print-color-adjust: exact;
//             color-adjust: exact;
//             z-index: 1000;
//           }

//           /* Main content area with padding to avoid overlapping */
//           .print-main-content {
//             padding-top: 100px;
//             padding-bottom: 100px;
//             width: 100%;
//           }

//           .print-hide {
//             display: none !important;
//           }

//           /* Ensure colors print correctly */
//           .print-content .bg-green-800 {
//             background-color: #086d32 !important;
//             -webkit-print-color-adjust: exact;
//             color-adjust: exact;
//           }

//           .print-content .text-white {
//             color: white !important;
//           }

//           .print-content .bg-gray-50 {
//             background-color: #f9fafb !important;
//             -webkit-print-color-adjust: exact;
//           }

//           .print-content .bg-green-50 {
//             background-color: #f0fdf4 !important;
//             -webkit-print-color-adjust: exact;
//           }

//           .print-content .bg-yellow-200 {
//             background-color: #fff3cd !important;
//             -webkit-print-color-adjust: exact;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProfessionalInvoiceWithNewChanges;