# 💬 Invoice Generating Chatbot

An AI-powered **invoice generating chatbot** built with **Next.js (App Router, JavaScript)**, **Tailwind CSS**, **Supabase**, and **PostgreSQL**.  
This application enables users to interact with a chatbot to create, edit, and finalize invoices in a conversational way.

---

## ✨ Features

- **🔑 Authentication**  
  - Secure user signup and login via Supabase.

- **💬 Conversational Invoice Creation**  
  - Chat naturally with the bot (e.g., _"I need 2 solar panels and 3 PDC"_).  
  - The chatbot extracts matching products from the query.  
  - User can select products and adjust quantities.  

- **📝 Draft & Finalize Invoices**  
  - Add customer details (name, address, notes).  
  - Generate a draft invoice.  
  - Finalize invoice with one click.  

- **✏️ Dynamic Invoice Editing via Chat**  
  - Ask the bot to update invoice fields:  
    - _"Change the quantity of solar panels to 10."_  
    - _"Update the customer name to John Doe and address to 123 Main St."_  
  - Changes are **highlighted in yellow** for easy review.  

- **📄 HTML-Based Invoice Template**  
  - Uses a **large, pre-designed HTML template** for both draft and finalized invoices.  
  - Dynamic data is injected into the template.  
  - Updated values are shown with highlights.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js (App Router, JavaScript)](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/)  
- **Backend & Auth:** [Supabase](https://supabase.com/)  
- **Database:** [PostgreSQL](https://www.postgresql.org/)  
- **Chatbot Logic:** Custom conversational flow with product parsing & invoice editing logic  

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/invoice-chatbot.git
cd invoice-chatbot
