

curl -X 'POST' \
  'http://localhost:8000/parse' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IkJNc1..' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "hey create an invoice for 2 pdc and 1 solar",
  "session_id": "b2e7027b-3004-4873-bb53-19c0c00b17b9"
}'



{
  "response_type": "product_search",
  "message": null,
  "extracted_items": [
    {
      "name": "pompa di calore",
      "quantity": 2
    },
    {
      "name": "kit fotovoltaico",
      "quantity": 1
    }
  ],
  "matched_products": [
    {
      "id": 79,
      "tipo": "PDC ARGO16",
      "immagine": "A",
      "zona_clim": "IVATO",
      "totale": 7197.2,
      "quota_gse": 1597.2,
      "pagam_cliente": 5600,
      "rateizzazione": 60,
      "iva": 112.1,
      "valore_rate": 112.1,
      "n_rate": 60,
      "installaz": 1500,
      "commerc": 300,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
      "similarity_score": 0.7
    },
    {
      "id": 80,
      "tipo": "PDC ARGO16",
      "immagine": "B",
      "zona_clim": "IVATO",
      "totale": 7229.6,
      "quota_gse": 2129.6,
      "pagam_cliente": 5100,
      "rateizzazione": 60,
      "iva": 102.1,
      "valore_rate": 102.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
      "similarity_score": 0.7
    },
    {
      "id": 81,
      "tipo": "PDC ARGO16",
      "immagine": "C",
      "zona_clim": "IVATO",
      "totale": 7228.2,
      "quota_gse": 2928.2,
      "pagam_cliente": 4300,
      "rateizzazione": 60,
      "iva": 86.1,
      "valore_rate": 86.1,
      "n_rate": 60,
      "installaz": 1500,
      "commerc": 300,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
      "similarity_score": 0.7
    },
    {
      "id": 82,
      "tipo": "PDC ARGO16",
      "immagine": "D",
      "zona_clim": "IVATO",
      "totale": 7226.8,
      "quota_gse": 3726.8,
      "pagam_cliente": 3500,
      "rateizzazione": 60,
      "iva": 70.1,
      "valore_rate": 70.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
      "similarity_score": 0.7
    },
    {
      "id": 83,
      "tipo": "PDC ARGO16",
      "immagine": "E",
      "zona_clim": "IVATO",
      "totale": 8025.4,
      "quota_gse": 4525.4,
      "pagam_cliente": 3500,
      "rateizzazione": 60,
      "iva": 70.1,
      "valore_rate": 70.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
      "similarity_score": 0.7
    },
    {
      "id": 84,
      "tipo": "PDC ARGO16",
      "immagine": "F",
      "zona_clim": "IVATO",
      "totale": 8291.6,
      "quota_gse": 4791.6,
      "pagam_cliente": 3500,
      "rateizzazione": 60,
      "iva": 70.1,
      "valore_rate": 70.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
      "similarity_score": 0.7
    },
    {
      "id": 97,
      "tipo": "PDC GENERA R290",
      "immagine": "A",
      "zona_clim": "IVATO",
      "totale": 7059.12,
      "quota_gse": 1259.12,
      "pagam_cliente": 5800,
      "rateizzazione": 60,
      "iva": 116.1,
      "valore_rate": 116.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Fornitura e posa in opera Pompa di calore ARGO/CARRIER R290 da 12kW (o similare) inverter (pompa di calore aria-acqua) per la climatizzazione invernale, ad alta efficienza inclusa fornitura e posa in opera di raccorderia, trasporto e scarico con gru. Con predisposizione ad anello già esistente",
      "similarity_score": 0.7
    },
    {
      "id": 98,
      "tipo": "PDC GENERA R290",
      "immagine": "B",
      "zona_clim": "IVATO",
      "totale": 7026.83,
      "quota_gse": 1726.83,
      "pagam_cliente": 5300,
      "rateizzazione": 60,
      "iva": 106.1,
      "valore_rate": 106.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Fornitura e posa in opera Pompa di calore ARGO/CARRIER R290 da 12kW (o similare) inverter (pompa di calore aria-acqua) per la climatizzazione invernale, ad alta efficienza inclusa fornitura e posa in opera di raccorderia, trasporto e scarico con gru. Con predisposizione ad anello già esistente",
      "similarity_score": 0.7
    },
    {
      "id": 99,
      "tipo": "PDC GENERA R290",
      "immagine": "C",
      "zona_clim": "IVATO",
      "totale": 7074.39,
      "quota_gse": 2374.39,
      "pagam_cliente": 4700,
      "rateizzazione": 60,
      "iva": 94.1,
      "valore_rate": 94.1,
      "n_rate": 60,
      "installaz": 1500,
      "commerc": 300,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Fornitura e posa in opera Pompa di calore ARGO/CARRIER R290 da 12kW (o similare) inverter (pompa di calore aria-acqua) per la climatizzazione invernale, ad alta efficienza inclusa fornitura e posa in opera di raccorderia, trasporto e scarico con gru. Con predisposizione ad anello già esistente",
      "similarity_score": 0.7
    },
    {
      "id": 100,
      "tipo": "PDC GENERA R290",
      "immagine": "D",
      "zona_clim": "IVATO",
      "totale": 7021.95,
      "quota_gse": 3021.95,
      "pagam_cliente": 4000,
      "rateizzazione": 60,
      "iva": 80.1,
      "valore_rate": 80.1,
      "n_rate": 60,
      "installaz": 0,
      "commerc": 0,
      "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
      "descrizione": "Fornitura e posa in opera Pompa di calore ARGO/CARRIER R290 da 12kW (o similare) inverter (pompa di calore aria-acqua) per la climatizzazione invernale, ad alta efficienza inclusa fornitura e posa in opera di raccorderia, trasporto e scarico con gru. Con predisposizione ad anello già esistente",
      "similarity_score": 0.7
    }
  ],
  "query_id": "query_20250903_212952",
  "session_id": "b2e7027b-3004-4873-bb53-19c0c00b17b9"
}



curl -X 'POST' \
  'http://localhost:8000/select' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIq15u0SY2OALnC4rPUKY' \
  -H 'Content-Type: application/json' \
  -d '{
  "query_id": "query_20250903_212952",
  "selected_product_ids": [
    79,80,81
  ]
}'

{
  "invoice_data": {
    "products": [
      {
        "product_id": 79,
        "tipo": "PDC ARGO16",
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "quantity": 1,
        "unit_price": 7197.2,
        "total_price": 7197.2,
        "zona_clim": "IVATO",
        "immagine": "A"
      },
      {
        "product_id": 80,
        "tipo": "PDC ARGO16",
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "quantity": 1,
        "unit_price": 7229.6,
        "total_price": 7229.6,
        "zona_clim": "IVATO",
        "immagine": "B"
      },
      {
        "product_id": 81,
        "tipo": "PDC ARGO16",
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "quantity": 1,
        "unit_price": 7228.2,
        "total_price": 7228.2,
        "zona_clim": "IVATO",
        "immagine": "C"
      }
    ],
    "subtotal": 21655,
    "tax_rate": 0.22,
    "tax_amount": 4764.1,
    "total_amount": 26419.1,
    "sender": "GreenGen Energy Solutions",
    "recipient": null,
    "building_site": null,
    "notes": null
  },
  "draft_id": "draft_20250903_213019"
}


curl -X 'POST' \
  'http://localhost:8000/invoices' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUz4l4IYq15u0SY2OALnC4rPUKY' \
  -H 'Content-Type: application/json' \
  -d '{
  "draft_id": "draft_20250903_213019",
  "recipient": "Dawood",
  "building_site": {
    "City": "Lahore",
    "Country": "Pakistan",
    "Postal": "54000"
  },
  "notes": "Hello"
}'

{
  "id": 40,
  "user_id": "36e85e99-c586-4093-a1b1-6de18773186b",
  "data": {
    "products": [
      {
        "product_id": 79,
        "tipo": "PDC ARGO16",
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "quantity": 1,
        "unit_price": 7197.2,
        "total_price": 7197.2,
        "zona_clim": "IVATO",
        "immagine": "A"
      },
      {
        "product_id": 80,
        "tipo": "PDC ARGO16",
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "quantity": 1,
        "unit_price": 7229.6,
        "total_price": 7229.6,
        "zona_clim": "IVATO",
        "immagine": "B"
      },
      {
        "product_id": 81,
        "tipo": "PDC ARGO16",
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza",
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "quantity": 1,
        "unit_price": 7228.2,
        "total_price": 7228.2,
        "zona_clim": "IVATO",
        "immagine": "C"
      }
    ],
    "subtotal": 21655,
    "tax_rate": 0.22,
    "tax_amount": 4764.1,
    "total_amount": 26419.1,
    "sender": "GreenGen Energy Solutions",
    "recipient": "Dawood",
    "building_site": {
      "City": "Lahore",
      "Country": "Pakistan",
      "Postal": "54000"
    },
    "notes": "Hello"
  },
  "status": "completed",
  "created_at": "2025-09-03T21:31:12.095030Z"
}


{
  "id": 0,
  "user_id": "string",
  "data": {
    "products": [
      {
        "product_id": 0,
        "tipo": "string",
        "descrizione_titolo": "string",
        "descrizione": "string",
        "quantity": 0,
        "unit_price": 0,
        "total_price": 0,
        "zona_clim": "string",
        "immagine": "string"
      }
    ],
    "subtotal": 0,
    "tax_rate": 0.22,
    "tax_amount": 0,
    "total_amount": 0,
    "sender": "GreenGen Energy Solutions",
    "recipient": "string",
    "building_site": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    },
    "notes": "string"
  },
  "status": "string",
  "created_at": "2025-09-03T16:40:38.208Z"
}


curl -X 'POST' \
  'http://localhost:8000/edit_invoice' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1Nibn2WKJUWP42sWALu7xSixWed8' \
  -H 'Content-Type: application/json' \
  -d '{
  "invoice_id": 40,
  "edit_instruction": "change notes to say hello there good morning"
}'


{
  "success": true,
  "message": "Invoice 40 updated successfully",
  "updated_invoice_data": {
    "notes": "hello there good morning",
    "sender": "GreenGen Energy Solutions",
    "products": [
      {
        "tipo": "PDC ARGO16",
        "immagine": "A",
        "quantity": 1,
        "zona_clim": "IVATO",
        "product_id": 79,
        "unit_price": 7197.2,
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "total_price": 7197.2,
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza"
      },
      {
        "tipo": "PDC ARGO16",
        "immagine": "B",
        "quantity": 1,
        "zona_clim": "IVATO",
        "product_id": 80,
        "unit_price": 7229.6,
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "total_price": 7229.6,
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza"
      },
      {
        "tipo": "PDC ARGO16",
        "immagine": "C",
        "quantity": 1,
        "zona_clim": "IVATO",
        "product_id": 81,
        "unit_price": 7228.2,
        "descrizione": "Pompa di calore ARGO 16, inclusa progettazione, pratica comunale, diagnosi energetica, pratica GSE e ogni altro onere necessario per l'ottenimento dell'incentivo Conto Termico.",
        "total_price": 7228.2,
        "descrizione_titolo": "Pompa di calore aria-acqua ad alta efficienza"
      }
    ],
    "subtotal": 21655,
    "tax_rate": 0.22,
    "recipient": "Dawood",
    "tax_amount": 4764.1,
    "total_amount": 26419.1,
    "building_site": {
      "City": "Lahore",
      "Postal": "54000",
      "Country": "Pakistan"
    }
  }
}