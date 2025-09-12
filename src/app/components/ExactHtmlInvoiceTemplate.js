import React, { useState, useEffect, useRef } from 'react';

const ExactHtmlInvoiceTemplate = ({
  invoiceData,
  invoiceId,
  isOffline = false,
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const iframeRef = useRef(null);

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

  const data = invoiceData?.data ||
    invoiceData || {
      recipient: "AZZURRA S.R.L - HOTEL EXECUTIVE",
      status: "pending",
      created_at: new Date().toISOString(),
      total_amount: 135000.0,
      subtotal: 193649.73,
      conto_termico_discount: 58649.73,
      credito_imposta: 87142.38,
      quota_cliente: 47857.62,
      building_site: {
        address: "VIA POZZO TRAIANO,24",
        city: "BRINDISI",
        postal_code: "72100",
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

  // Function to generate dynamic product table rows
  const generateProductRows = () => {
    return (
      data.products
        ?.map(
          (item) => `
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
    `
        )
        .join("") || ""
    );
  };

  // Function to generate the summary table with dynamic data
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

      // Apply all the same replacements as in the print function
      htmlContent = htmlContent.replace(
        /AZZURRA S\.R\.L - HOTEL EXECUTIVE/g,
        data.recipient || "AZZURRA S.R.L - HOTEL EXECUTIVE"
      );

      htmlContent = htmlContent.replace(
        /<h3[^>]*>\s*BRINDISI\s*<\/h3>/,
        `<h3 style="padding-top: 7pt; padding-left: 14pt; text-indent: 0pt; text-align: left;">
          ${[
            data.building_site?.address || data.building_site?.Address,
            data.building_site?.postal_code || data.building_site?.Postal,
            data.building_site?.city || data.building_site?.City,
            data.building_site?.country || data.building_site?.Country
          ].filter(Boolean).join(", ") || "BRINDISI"}
        </h3>`
      );

      htmlContent = htmlContent.replace(
        /<span style="color: #1d5054">28\/05\/2025<\/span>/g,
        `<span style="color: #1d5054">${formatDate(data.created_at)}</span>`
      );

      htmlContent = htmlContent.replace(
        /<h3 style="text-indent: 0pt; text-align: left">BRINDISI<\/h3>/,
        `<h3 style="text-indent: 0pt; padding-left: 18pt; text-align: left">
          ${data.building_site?.city || data.building_site?.City || 'BRINDISI'}
        </h3>`
      );

      htmlContent = htmlContent.replace(
        /<h4[^>]*>VIA POZZO TRAIANO,24<\/h4>/g,
        `<h4 style="padding-top: 5pt; padding-left: 14pt; text-indent: 0pt; text-align: left;">${data.building_site?.address || ''}</h4>`
      );

      htmlContent = htmlContent.replace(
        /<span style="color: #1d5054">456a\/2025<\/span>/g,
        `<span style="color: #1d5054">${invoiceId || "456a/2025"}</span>`
      );

      if (data.revision_number || data.author) {
        htmlContent = htmlContent.replace(
          /<span style="color: #1d5054">8 <\/span>Da:\s*<span style="color: #1d5054">GABRIELE<\/span>/,
          `<span style="color: #1d5054">${data.revision_number || '8'} </span>Da: <span style="color: #1d5054">${data.author || 'GABRIELE'}</span>`
        );
      }

      // Financial Summary replacements
      htmlContent = htmlContent.replace(
        /193\.649,73 €/g,
        `${(data.subtotal || 193649.73).toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €`
      );

      htmlContent = htmlContent.replace(
        /-58\.649,73 €/g,
        `-${(data.conto_termico_discount || 58649.73).toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €`
      );

      htmlContent = htmlContent.replace(
        /135\.000,00 €/g,
        `${(data.total_amount || 135000.0).toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €`
      );

      htmlContent = htmlContent.replace(
        /-87\.142,38 €/g,
        `-${(data.credito_imposta || 87142.38).toLocaleString("it-IT", {
          minimumFractionDigits: 2,
        })} €`
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
      setEditableContent(htmlContent);
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

  const enableEditing = () => {
    // This function is no longer needed - removed manual editing
  };

  const disableEditing = () => {
    // This function is no longer needed - removed manual editing
  };

  const handleContentChange = () => {
    // This function is no longer needed - removed manual editing
  };

  const handlePrint = async () => {
    // Clear all selection styling before printing
    clearAllSelections();
    
    // Wait a moment for styles to clear
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get clean HTML without any selection styling
    const contentToPrint = getCleanHtmlForPrint();
    
    if (!contentToPrint) {
      alert("Could not load the template for printing.");
      return;
    }

    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768;

      if (isMobile) {
        const blob = new Blob([contentToPrint], { type: 'text/html' });
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
          directWindow.document.write(contentToPrint);
          directWindow.document.close();
          setTimeout(() => directWindow.print(), 500);
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        printWindow.document.write(contentToPrint);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }

    } catch (error) {
      console.error("Error printing:", error);
      alert("Could not print the document. Please try again.");
    }
  };

  // AI editing functionality with multiple element selection
  const handleElementSelection = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Add click listeners to editable elements
    const editableElements = iframeDoc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, td');
    
    editableElements.forEach(el => {
      el.style.cursor = 'pointer';
      el.style.transition = 'background-color 0.2s';
      
      el.addEventListener('mouseenter', () => {
        if (!selectedElements.includes(el)) {
          el.style.backgroundColor = '#e3f2fd';
        }
      });
      
      el.addEventListener('mouseleave', () => {
        if (!selectedElements.includes(el)) {
          el.style.backgroundColor = '';
        }
      });
      
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const elementText = el.textContent?.trim() || '';
        
        // Check if element is already selected
        const elementIndex = selectedElements.indexOf(el);
        
        if (elementIndex > -1) {
          // Element is selected, remove it
          const newSelectedElements = [...selectedElements];
          const newSelectedTexts = [...selectedTexts];
          
          newSelectedElements.splice(elementIndex, 1);
          newSelectedTexts.splice(elementIndex, 1);
          
          setSelectedElements(newSelectedElements);
          setSelectedTexts(newSelectedTexts);
          
          // Remove styling
          el.style.backgroundColor = '';
          el.style.outline = '';
        } else {
          // Element is not selected, add it
          setSelectedElements(prev => [...prev, el]);
          setSelectedTexts(prev => [...prev, elementText]);
          
          // Add styling with different colors for different selections
          const colorIndex = selectedElements.length % 4;
          const colors = [
            { bg: '#bbdefb', outline: '#2196f3' }, // Blue
            { bg: '#c8e6c9', outline: '#4caf50' }, // Green
            { bg: '#ffecb3', outline: '#ff9800' }, // Orange
            { bg: '#f8bbd9', outline: '#e91e63' }  // Pink
          ];
          
          el.style.backgroundColor = colors[colorIndex].bg;
          el.style.outline = `2px solid ${colors[colorIndex].outline}`;
        }
      });
    });
  };

  const handleAiEdit = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter an edit instruction.');
      return;
    }

    if (selectedElements.length === 0) {
      alert('Please click on elements in the invoice to select them for editing.');
      return;
    }

    setIsAiEditing(true);
    
    try {
      // Process each selected element with specific context
      const updatePromises = selectedElements.map(async (element, index) => {
        const elementText = selectedTexts[index];
        
        // Determine element type and context based on content and position
        let elementType = 'text';
        let specificContext = '';
        const textLower = elementText.toLowerCase();
        
        // More specific context detection
        if (textLower.includes('€') || /\d+[.,]\d+/.test(textLower)) {
          elementType = 'amount';
          if (textLower.includes('€')) {
            specificContext = 'Currency amount in European format';
          } else {
            specificContext = 'Numerical value that may need currency formatting';
          }
        } else if (/\d{2}\/\d{2}\/\d{4}/.test(textLower)) {
          elementType = 'date';
          specificContext = 'Date in Italian DD/MM/YYYY format';
        } else if (textLower.includes('via') || textLower.includes('strada') || textLower.includes('piazza')) {
          elementType = 'address';
          specificContext = 'Street address or location';
        } else if (textLower.includes('s.r.l') || textLower.includes('spa') || textLower.includes('s.p.a')) {
          elementType = 'company';
          specificContext = 'Company or business name';
        } else if (/^\d+$/.test(textLower)) {
          elementType = 'number';
          specificContext = 'Numerical value (quantity, code, etc.)';
        } else if (textLower.length < 10 && /^[A-Z]+$/.test(elementText.replace(/\s/g, ''))) {
          elementType = 'code';
          specificContext = 'Product code or identifier';
        } else if (elementText.length > 50) {
          elementType = 'description';
          specificContext = 'Product or service description';
        } else {
          elementType = 'text';
          specificContext = 'General text content';
        }

        // Create a more specific prompt based on element content and type
        const contextualPrompt = `${aiPrompt.trim()}. 

IMPORTANT: This specific element contains "${elementText}" which is a ${elementType} (${specificContext}). 
Apply the instruction specifically to this ${elementType} element while maintaining appropriate formatting for this type of content.`;

        const response = await fetch('/api/ai-edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedText: elementText,
            elementType: elementType,
            prompt: contextualPrompt,
            context: `${specificContext} - Element ${index + 1} of ${selectedElements.length}: "${elementText}"`
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to process element ${index + 1}: ${elementText}`);
        }

        return {
          element,
          newText: data.updatedText,
          index,
          originalText: elementText
        };
      });

      const results = await Promise.all(updatePromises);
      
      // Apply all updates
      const newSelectedTexts = [...selectedTexts];
      results.forEach(({ element, newText, index, originalText }) => {
        if (newText && newText !== originalText) {
          element.textContent = newText;
          newSelectedTexts[index] = newText;
          console.log(`Updated element ${index + 1}: "${originalText}" → "${newText}"`);
        }
      });
      
      // Update state
      setSelectedTexts(newSelectedTexts);
      
      // Update the content in state
      const iframe = iframeRef.current;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const updatedContent = iframeDoc.documentElement.outerHTML;
        setEditableContent(updatedContent);
        setHtmlContent(updatedContent);
      }
      
      setAiPrompt(''); // Clear the prompt after successful edit
      
    } catch (error) {
      console.error('AI Edit Error:', error);
      alert(`Failed to apply AI edit: ${error.message}`);
    } finally {
      setIsAiEditing(false);
    }
  };

  const clearAllSelections = () => {
    selectedElements.forEach(el => {
      el.style.backgroundColor = '';
      el.style.outline = '';
      el.style.border = '';
      el.style.boxShadow = '';
    });
    setSelectedElements([]);
    setSelectedTexts([]);
  };

  const getCleanHtmlForPrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return editableContent || htmlContent;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Create a clone of the document to clean
    const clonedDoc = iframeDoc.cloneNode(true);
    
    // Remove only selection-related styling from the clone, preserve everything else
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.style) {
        // Only remove selection-specific styles, preserve all other styles
        const currentStyle = el.getAttribute('style') || '';
        
        // Remove selection-related properties but keep everything else
        let cleanedStyle = currentStyle
          .replace(/background-color\s*:\s*[^;]*;?/gi, '')
          .replace(/outline\s*:\s*[^;]*;?/gi, '')
          .replace(/box-shadow\s*:\s*[^;]*;?/gi, '')
          .replace(/cursor\s*:\s*[^;]*;?/gi, '')
          .replace(/transition\s*:\s*[^;]*;?/gi, '')
          .replace(/;;+/g, ';') // Remove double semicolons
          .replace(/^;|;$/g, '') // Remove leading/trailing semicolons
          .trim();
        
        // Update the style attribute
        if (cleanedStyle) {
          el.setAttribute('style', cleanedStyle);
        } else {
          el.removeAttribute('style');
        }
      }
    });
    
    return clonedDoc.documentElement.outerHTML;
  };

  const handlePromptKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiEdit();
    }
  };

  return (
    <>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          .print-hide {
            display: none !important;
          }
          .print-hide .bg-blue-50, 
          .print-hide .bg-yellow-50, 
          .print-hide .bg-gray-50, 
          .print-hide .bg-gray-100 {
            background: white !important;
          }
          .print-hide .border, 
          .print-hide .border-gray-200, 
          .print-hide .border-blue-200, 
          .print-hide .border-yellow-200 {
            border: none !important;
          }
          .print-hide .shadow-lg, 
          .print-hide .shadow-sm {
            box-shadow: none !important;
          }
          .print-hide .rounded-lg, 
          .print-hide .rounded {
            border-radius: 0 !important;
          }
          /* Ensure table borders are preserved */
          table, td, th {
            border-collapse: collapse !important;
          }
          table td[style*="border"], 
          table th[style*="border"] {
            border: inherit !important;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="print-content bg-white relative" style={{ minHeight: "8.7cm", fontFamily: "Arial, sans-serif" }}>
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
                <div className="w-full bg-white rounded shadow-sm border border-gray-200 relative">
                  <iframe
                    ref={iframeRef}
                    srcDoc={editableContent || htmlContent}
                    className="w-full border-0"
                    style={{ 
                      height: '600px',
                      minHeight: '500px'
                    }}
                    title="Invoice Preview"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={() => {
                      // Enable element selection for AI editing
                      handleElementSelection();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Edit Interface */}
        <div className="print-hide mt-4 px-4">
          <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              AI Edit Invoice
            </h3>
            
            {/* Selection Status */}
            {selectedElements.length > 0 ? (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-800">
                    Selected Elements ({selectedElements.length}):
                  </p>
                  <button
                    onClick={clearAllSelections}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Clear All Selections
                  </button>
                </div>
                <div className="space-y-1">
                  {selectedTexts.map((text, index) => (
                    <p key={index} className="text-blue-600 font-mono text-sm break-all">
                       {text}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  👆 Click on text elements in the invoice above to select them for editing.
                  <br /> 
                  💡 You can select multiple elements (they will be highlighted in different colors).
                 </p>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Enter your instruction to apply to {selectedElements.length > 0 ? 'all selected elements' : 'selected elements'} 
            {(e.g, "change to Rome", "make it €500", "update to 22/10/22")}  
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyPress={handlePromptKeyPress}
                  placeholder={selectedElements.length > 0 ? "Enter your edit instruction..." : "First click on text to select it"}
                  className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  disabled={isAiEditing || loading || selectedElements.length === 0}
                />
              </div>
              <button
                onClick={handleAiEdit}
                disabled={isAiEditing || loading || !aiPrompt.trim() || selectedElements.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium active:scale-95 whitespace-nowrap"
              >
                {isAiEditing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    AI Editing...
                  </span>
                ) : (
                  `Apply AI Edit ${selectedElements.length > 1 ? `(${selectedElements.length} elements)` : ''}`
                )}
              </button>
            </div>
            
            {isAiEditing && (
              <div className="mt-3 text-sm text-blue-600">
                Processing your request with AI for {selectedElements.length} element{selectedElements.length > 1 ? 's' : ''}...
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
          Stampa Preventivo
        </button>
      </div>
        </div>
      </>
  );
};

export default ExactHtmlInvoiceTemplate;


