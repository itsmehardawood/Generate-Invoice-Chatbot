import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { selectedText, elementType, prompt, context } = await request.json();

    // Validate required fields
    if (!selectedText || !prompt) {
      console.error('Missing required fields:', { selectedText: !!selectedText, prompt: !!prompt });
      return NextResponse.json(
        { error: 'Selected text and prompt are required' },
        { status: 400 }
      );
    }

    // Check for Groq API key
    const groqApiKey = process.env.GROQ_API_KEY;
    console.log('Groq API Key status:', groqApiKey ? 'Present' : 'Missing');
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY environment variable not found');
      return NextResponse.json(
        { 
          error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env.local file.',
          details: 'Get your API key from https://console.groq.com/keys'
        },
        { status: 500 }
      );
    }

    // Prepare the system prompt for Groq
    const systemPrompt = `You are an expert text editor for invoice elements. You will receive:
1. A specific text/value from an invoice element
2. The type of element (e.g., "amount", "date", "address", "company", "code", "description")
3. A natural language instruction to modify that text
4. Context about the specific element and its current content

Your task is to:
- Analyze the current text value and its context
- Apply the requested changes based on the natural language instruction
- Return ONLY the new text value (no HTML tags, no explanations, no quotes)
- Keep the same format/structure as the original when appropriate
- For amounts: maintain proper European currency formatting (e.g., "1.234,56 €")
- For dates: use Italian format (DD/MM/YYYY) when applicable
- For addresses: maintain proper capitalization and formatting
- For codes: maintain appropriate formatting (uppercase, etc.)
- For descriptions: maintain proper grammar and structure
- Be context-aware: understand what type of content you're editing

CRITICAL: Each edit request is for ONE specific element. The instruction may be general, but apply it appropriately to THIS specific element type and content.

Return ONLY the new text value, nothing else.`;

    const userPrompt = `Element Type: ${elementType || 'text'}
Current Content: "${selectedText}"
${context ? `Specific Context: ${context}` : ''}

Instruction: ${prompt}

Apply this instruction specifically to this ${elementType || 'text'} element. Return only the new content:`;

    // Call Groq API
    console.log('Calling Groq API with prompt length:', prompt.length);
    console.log('Selected text length:', selectedText.length);
    console.log('Element type:', elementType);
    console.log('Context:', context);
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent output
        max_tokens: 200, // Much smaller since we're only editing specific text
      }),
    });

    console.log('Groq API response status:', groqResponse.status);

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('Groq API error:', {
        status: groqResponse.status,
        statusText: groqResponse.statusText,
        error: errorData
      });
      return NextResponse.json(
        { 
          error: 'Failed to process AI edit request',
          details: errorData.error?.message || `API returned status ${groqResponse.status}`
        },
        { status: 500 }
      );
    }

    const groqData = await groqResponse.json();
    const updatedText = groqData.choices[0]?.message?.content?.trim();

    console.log('Groq response received, text length:', updatedText?.length || 0);

    if (!updatedText) {
      console.error('No content in Groq response:', groqData);
      return NextResponse.json(
        { error: 'No response from AI model' },
        { status: 500 }
      );
    }

    console.log('Successfully processed AI edit request');
    return NextResponse.json({
      success: true,
      updatedText: updatedText
    });

  } catch (error) {
    console.error('AI Edit API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}