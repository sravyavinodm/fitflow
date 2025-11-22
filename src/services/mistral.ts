import { Mistral } from "@mistralai/mistralai";

// Initialize Mistral client
const getMistralClient = () => {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  
  if (!apiKey) {
    throw new Error('Mistral API key is not configured. Please set VITE_MISTRAL_API_KEY in your environment variables.');
  }

  return new Mistral({
    apiKey: apiKey,
  });
};

export interface MistralMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MistralChatOptions {
  messages: MistralMessage[];
  userDataJson?: string; // Optional: include user data context
}

/**
 * Send a message to Mistral AI agent and get response
 */
export const sendMessageToMistral = async (
  messages: MistralMessage[],
  userDataJson?: string
): Promise<string> => {
  try {
    const agentId = import.meta.env.VITE_MISTRAL_AGENT_ID;
    
    if (!agentId) {
      throw new Error('Mistral Agent ID is not configured. Please set VITE_MISTRAL_AGENT_ID in your environment variables.');
    }

    const mistral = getMistralClient();

    // Prepare messages for the agent
    // If user data is provided, prepend it as a system context message
    const agentMessages = userDataJson
      ? [
          {
            role: 'user' as const,
            content: `User Data Context:\n${userDataJson}\n\nPlease use this data to provide personalized responses.`,
          },
          ...messages,
        ]
      : messages;

    const result = await mistral.agents.complete({
      messages: agentMessages,
      agentId: agentId,
    });

    // Extract the response text
    if (result.choices && result.choices.length > 0) {
      const content = result.choices[0].message?.content;
      if (content) {
        // Handle both string and ContentChunk[] types
        if (typeof content === 'string') {
          return content;
        } else if (Array.isArray(content)) {
          // If content is an array of chunks, extract text from each chunk
          return content.map(chunk => {
            if (typeof chunk === 'string') {
              return chunk;
            }
            // Handle ContentChunk - check for text property or type
            if ('text' in chunk && typeof chunk.text === 'string') {
              return chunk.text;
            }
            if ('type' in chunk && chunk.type === 'text' && 'text' in chunk) {
              return (chunk as any).text || '';
            }
            return '';
          }).filter(text => text.length > 0).join('');
        }
      }
    }

    throw new Error('No response from Mistral AI');
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    
    if (error instanceof Error) {
      // Return user-friendly error message
      if (error.message.includes('API key')) {
        throw new Error('AI service configuration error. Please contact support.');
      }
      if (error.message.includes('Agent ID')) {
        throw new Error('AI service configuration error. Please contact support.');
      }
      throw error;
    }
    
    throw new Error('Failed to get response from AI. Please try again.');
  }
};

/**
 * Check if Mistral AI is properly configured
 */
export const isMistralConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  const agentId = import.meta.env.VITE_MISTRAL_AGENT_ID;
  return !!(apiKey && agentId);
};

