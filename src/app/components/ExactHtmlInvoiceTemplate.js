// Enhanced version with print preview

"use client";

import Image from "next/image";
import { useState } from "react";

const ExactHtmlInvoiceTemplate = ({
  invoiceData,
  invoiceId,
  isOffline = false,
}) => {
  const [showPreview, setShowPreview] = useState(false);

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

  const handlePrint = async () => {
    try {
      // Load the original HTML template
      const response = await fetch("/invoice-template.html");
      let htmlContent = await response.text();

      if (!htmlContent) {
        throw new Error("Could not load HTML template");
      }

      // Replace recipient/client name
      htmlContent = htmlContent.replace(
        /AZZURRA S\.R\.L - HOTEL EXECUTIVE/g,
        data.recipient || "AZZURRA S.R.L - HOTEL EXECUTIVE"
      );




    htmlContent = htmlContent.replace(
  /<h3[^>]*>\s*BRINDISI\s*<\/h3>/,
  `<h3 style="padding-top: 7pt; padding-left: 14pt; text-indent: 0pt; text-align: left;">
    ${
      [
        data.building_site?.address || data.building_site?.Address,
        data.building_site?.postal_code || data.building_site?.Postal,
        data.building_site?.city || data.building_site?.City,
        data.building_site?.country || data.building_site?.Country
      ].filter(Boolean).join(", ") || "BRINDISI"
    }
  </h3>`
);


      // Replace first address occurrence (in client info section)

 


      // Replace date
      htmlContent = htmlContent.replace(
        /<span style="color: #1d5054">28\/05\/2025<\/span>/g,
        `<span style="color: #1d5054">${formatDate(data.created_at)}</span>`
      );

      // Replace destination city (second BRINDISI occurrence)
      htmlContent = htmlContent.replace(
        /<h3 style="text-indent: 0pt; text-align: left">BRINDISI<\/h3>/,
`<h3 style="text-indent: 0pt; padding-left: 18pt; text-align: left">
    ${data.building_site?.city || data.building_site?.City || 'BRINDISI'}
  </h3>`
      );

      // Replace destination address (second address occurrence)
      htmlContent = htmlContent.replace(
        /<h4[^>]*>VIA POZZO TRAIANO,24<\/h4>/g,
        `<h4 style="padding-top: 5pt; padding-left: 14pt; text-indent: 0pt; text-align: left;">${data.building_site?.address || ''}</h4>`
      );

      // Replace invoice number
      htmlContent = htmlContent.replace(
        /<span style="color: #1d5054">456a\/2025<\/span>/g,
        `<span style="color: #1d5054">${invoiceId || "456a/2025"}</span>`
      );

      // Replace revision number and author if available
      if (data.revision_number || data.author) {
        htmlContent = htmlContent.replace(
          /<span style="color: #1d5054">8 <\/span>Da:\s*<span style="color: #1d5054">GABRIELE<\/span>/,
          `<span style="color: #1d5054">${data.revision_number || '8'} </span>Da: <span style="color: #1d5054">${data.author || 'GABRIELE'}</span>`
        );
      }

      // Add postal code and country if available
      if (data.building_site?.postal_code || data.building_site?.country) {
        const addressPattern = /<h4[^>]*style="padding-top: 5pt; padding-left: 14pt[^>]*>.*?<\/h4>/;
        htmlContent = htmlContent.replace(
          addressPattern,
          (match) => {
            let additionalInfo = '';
            if (data.building_site?.postal_code) {
              additionalInfo += `<p style="padding-left: 14pt; text-indent: 0pt; text-align: left;">${data.building_site.postal_code}</p>`;
            }
            if (data.building_site?.country) {
              additionalInfo += `<p style="padding-left: 14pt; text-indent: 0pt; text-align: left;">${data.building_site.country}</p>`;
            }
            return match + additionalInfo;
          }
        );
      }

      // Financial Summary
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
      const productTableStart = htmlContent.indexOf(
        '<tr style="height: 142pt">'
      );
      const productTableEnd = htmlContent.indexOf(
        "</table>",
        productTableStart
      );

      if (productTableStart !== -1 && productTableEnd !== -1) {
        const beforeTable = htmlContent.substring(0, productTableStart);
        const afterTable = htmlContent.substring(productTableEnd);
        htmlContent = beforeTable + generateProductRows() + afterTable;
      }

      // Replace summary table
      const summaryTableStart = htmlContent.indexOf(
        '<tr style="height: 41pt">'
      );
      const summaryTableEnd =
        htmlContent.indexOf(
          "</tr>",
          htmlContent.indexOf("</tr>", summaryTableStart) + 5
        ) + 5;

      if (summaryTableStart !== -1 && summaryTableEnd !== -1) {
        const beforeSummary = htmlContent.substring(0, summaryTableStart);
        const afterSummary = htmlContent.substring(summaryTableEnd);
        htmlContent = beforeSummary + generateSummaryTable() + afterSummary;
      }

      // Open in print window
      const printWindow = window.open("", "_blank", "width=800,height=600");
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Error loading HTML template:", error);
      alert(
        "Could not load the original template. Please make sure the HTML file is accessible."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      <div
        className="print-content bg-white relative"
        style={{ minHeight: "8.7cm", fontFamily: "Arial, sans-serif" }}
      >
        {/* Toggle buttons */}
        <div className="print-hide flex justify-center gap-4 p-4 bg-gray-100 border-b">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              !showPreview 
                ? 'bg-teal-700 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Vista Normale
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-teal-700 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Anteprima Stampa
          </button>
        </div>

        {/* Main content area */}
        <div className="print-main-content">
          {showPreview ? (
            /* Print Preview Section */
            <div className="p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
              {/* Simulated Print Header */}
              <div className="mb-6 p-4 bg-green-800 text-white rounded-lg">
                <div className="text-center">
                  <h1 className="text-xl font-bold">FATTURA ELETTRONICA</h1>
                  <div className="text-sm mt-2">
                    {formatDate(data.created_at)} - N. {invoiceId || "456a/2025"}
                  </div>
                </div>
              </div>

              {/* Invoice Details Preview */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 text-black border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  {/* Client Info */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Cliente</h3>
                    <div className="text-sm space-y-1">
                      <div className="font-semibold">{data.recipient}</div>
                      <div>{data.building_site?.address}</div>
                      <div>{data.building_site?.city} {data.building_site?.postal_code}</div>
                      <div>{data.building_site?.country}</div>
                    </div>
                  </div>
                  
                  {/* Invoice Info */}
                  <div className="text-right">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Dettagli Fattura</h3>
                    <div className="text-sm space-y-1">
                      <div><span className="font-medium">Numero:</span> {invoiceId || "456a/2025"}</div>
                      <div><span className="font-medium">Data:</span> {formatDate(data.created_at)}</div>
                      <div><span className="font-medium">Revisione:</span> {data.revision_number || '8'}</div>
                      <div><span className="font-medium">Da:</span> {data.author || 'GABRIELE'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Preview Table */}
              <div className="mb-6 text-black">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Prodotti/Servizi</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-left">Codice</th>
                        <th className="border border-gray-300 p-2 text-left">Descrizione</th>
                        <th className="border border-gray-300 p-2 text-center">Qtà</th>
                        <th className="border border-gray-300 p-2 text-center">U.M.</th>
                        <th className="border border-gray-300 p-2 text-right">Prezzo Unit.</th>
                        <th className="border border-gray-300 p-2 text-right">Totale</th>
                        <th className="border border-gray-300 p-2 text-right">Incentivi</th>
                        <th className="border border-gray-300 p-2 text-right">Quota Cliente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.products?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2 font-medium">
                            {item.codice || item.P_code || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <div className="font-medium mb-1">{item.tipo || item.name || ""}</div>
                            <div className="text-xs text-gray-600 leading-tight">
                              {item.descrizione || item.description || item.descrizione_titolo || ""}
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {item.quantity || 1}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {item.udm || "Nr"}
                          </td>
                          <td className="border border-gray-300 p-2 text-right">
                            {(item.unit_price || 0).toLocaleString("it-IT", {
                              minimumFractionDigits: 2,
                            })} €
                          </td>
                          <td className="border border-gray-300 p-2 text-right">
                            {(item.total_price || item.totale || 0).toLocaleString("it-IT", {
                              minimumFractionDigits: 2,
                            })} €
                          </td>
                          <td className="border border-gray-300 p-2 text-right">
                            {(item.incentivi || item.quota_gse || 0).toLocaleString("it-IT", {
                              minimumFractionDigits: 2,
                            })} €
                          </td>
                          <td className="border border-gray-300 p-2 text-right font-medium">
                            {(item.quota_cliente || item.pagam_cliente || 0).toLocaleString("it-IT", {
                              minimumFractionDigits: 2,
                            })} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary Preview */}
              <div className="bg-gray-100 p-6 rounded-lg text-black">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Riepilogo Economico</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotale:</span>
                      <span className="font-medium">
                        {(data.subtotal || 0).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })} €
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Conto Termico:</span>
                      <span className="font-medium">
                        -{(data.conto_termico_discount || 0).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })} €
                      </span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Credito Imposta:</span>
                      <span className="font-medium">
                        -{(data.credito_imposta || 0).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })} €
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-gray-300 pl-6">
                    <div className="text-right space-y-2">
                      <div className="flex justify-between">
                        <span>Costo Totale:</span>
                        <span className="font-medium">
                          {(data.total_amount || 0).toLocaleString("it-IT", {
                            minimumFractionDigits: 2,
                          })} €
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-4">
                        <div className="flex justify-between text-lg font-bold text-teal-700">
                          <span>QUOTA CLIENTE:</span>
                          <span>
                            {(data.quota_cliente || 0).toLocaleString("it-IT", {
                              minimumFractionDigits: 2,
                            })} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Print Footer */}
              <div className="mt-6 p-4 bg-green-800 text-white rounded-lg text-center text-sm">
                <div>© 2025 - Fattura generata digitalmente</div>
              </div>
            </div>
          ) : (
            /* Normal View - Original Content */
            <div className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Preventivo Professionale
                </h2>

                <div className="bg-gray-50 p-6 rounded-lg mb-6 text-black">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Informazioni Preventivo
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cliente:</span> {data.recipient}
                    </div>
                    <div>
                      <span className="font-medium">Numero:</span>{" "}
                      {invoiceId || "456a/2025"}
                    </div>
                    <div>
                      <span className="font-medium">Data:</span>{" "}
                      {formatDate(data.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Città:</span>{" "}
                      {data.building_site?.city}
                    </div>
                    <div>
                      <span className="font-medium">Indirizzo:</span>{" "}
                      {data.building_site?.address}
                    </div>
                    <div>
                      <span className="font-medium">Prodotti:</span>{" "}
                      {data.products?.length || 0}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 text-black rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Riepilogo Economico
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Costo Totale:</span> €
                      {(data.subtotal || 0).toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Conto Termico:</span> -€
                      {(data.conto_termico_discount || 0).toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Credito Imposta:</span> -€
                      {(data.credito_imposta || 0).toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="col-span-2 pt-2 border-t">
                      <span className="font-bold text-lg">
                        Quota Cliente: €
                        {(data.quota_cliente || 0).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
        }
      `}</style>
    </div>
  );
};

export default ExactHtmlInvoiceTemplate;