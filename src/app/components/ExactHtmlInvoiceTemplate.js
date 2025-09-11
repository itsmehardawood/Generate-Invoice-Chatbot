import React, { useState, useEffect } from 'react';

const ExactHtmlInvoiceTemplate = ({
  invoiceData,
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
          Stampa Preventivo Originale
        </button>
      </div>
    </div>
  );
};

export default ExactHtmlInvoiceTemplate;




