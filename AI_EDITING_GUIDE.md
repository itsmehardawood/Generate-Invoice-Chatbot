# AI Invoice Editing Feature - Targeted Element Editing

## Overview
This feature allows you to edit specific parts of invoices using natural language prompts powered by Groq's LLaMA 3.3 70B model. Instead of sending the entire invoice, it uses a targeted approach where you click on specific elements to edit them.

## How It Works
1. **Click to Select**: Click on any text in the invoice to select it for editing
2. **Visual Feedback**: Selected elements are highlighted with a blue outline
3. **Targeted Editing**: Only the selected text is sent to the AI for processing
4. **Smart Context**: The system automatically detects element types (amounts, dates, addresses, etc.)

## Setup

### 1. Environment Variables
Create a `.env.local` file in the project root and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

You can get a free API key from [Groq Console](https://console.groq.com/keys).

### 2. Usage
1. **Select Element**: Click on any text in the invoice preview to select it
2. **Enter Instruction**: Type your edit instruction in the input field
3. **Apply Changes**: Click "Apply AI Edit" or press Enter
4. **See Results**: The selected element updates instantly

## Example Workflows

### Editing Different Elements
- **Click on city name** → Type: "change to Rome" → Updates: "BRINDISI" → "ROME"
- **Click on amount** → Type: "make it 500 euros" → Updates: "1.234,56 €" → "500,00 €"
- **Click on date** → Type: "update to today" → Updates to current date
- **Click on address** → Type: "change to Via Roma 123" → Updates address
- **Click on company name** → Type: "change to ABC Company" → Updates company

### Smart Context Detection
The system automatically detects element types:
- **Amounts**: Maintains € currency formatting
- **Dates**: Uses Italian DD/MM/YYYY format
- **Addresses**: Proper capitalization and formatting
- **Companies**: Business name formatting

## Features
- **🎯 Targeted Editing**: Only selected elements are processed, reducing token usage
- **👁️ Visual Selection**: Clear highlighting shows what will be edited
- **🧠 Smart Detection**: Automatic element type recognition
- **⚡ Fast Processing**: Much smaller context = faster responses
- **✅ Preserves Formatting**: Maintains original styling and structure
- **🔄 Real-time Updates**: Changes appear instantly in the preview

## UI Features
- **Selection Indicator**: Blue highlighting for selected elements
- **Status Display**: Shows currently selected text
- **Clear Selection**: Easy way to deselect elements
- **Hover Effects**: Visual feedback when hovering over elements
- **Smart Placeholders**: Context-aware input placeholders

## Technical Improvements
- **Reduced Token Usage**: ~95% reduction in API call size
- **Lower Cost**: Much cheaper per API call
- **Faster Response**: Smaller context = quicker processing
- **Better Accuracy**: Focused context improves AI understanding
- **No Context Limits**: Avoids "context length exceeded" errors

## API Endpoint
- **URL**: `/api/ai-edit`
- **Method**: POST
- **Body**: 
  ```json
  {
    "selectedText": "BRINDISI",
    "elementType": "city",
    "prompt": "change to Rome",
    "context": "Invoice editing - city field"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "updatedText": "ROME"
  }
  ```

## Element Types Detected
- `amount`: Currency values with € symbol
- `date`: DD/MM/YYYY format dates
- `address`: Street addresses with "via", "strada", etc.
- `company`: Business names with S.R.L, SPA, etc.
- `text`: General text content

## Troubleshooting
- **Nothing happens when clicking**: Make sure the iframe has loaded completely
- **Selection not visible**: Try refreshing the page
- **API errors**: Check that GROQ_API_KEY is set correctly
- **Text not updating**: Ensure the element was properly selected (blue outline visible)