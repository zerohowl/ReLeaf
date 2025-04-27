// chatController.ts - Handles interaction with Fetch.ai agents
import { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// We load the SDK dynamically only if needed
let AiEngine: any = null;
let enginePromise: Promise<any> | null = null;
const fetchAiApiKey = process.env.FETCHAI_API_KEY; // Key from backend .env

interface AgentResponse {
  text: string;
  sourceType?: string;
  metadata?: any;
}

// Lazy load the AI Engine SDK
const getEngine = async () => {
  if (!fetchAiApiKey) {
    console.error('No FETCHAI_API_KEY in environment');
    return null;
  }
  
  // Use cached engine if available
  if (enginePromise) {
    try {
      return await enginePromise;
    } catch (error) {
      console.error('Cached engine promise failed:', error);
      enginePromise = null; // Reset if cached promise fails
    }
  }

  try {
    console.log(`[ChatController] Initializing AI Engine with key: ${fetchAiApiKey.substring(0, 10)}...`);
    // Dynamic import for the SDK
    const sdk = await import('@fetchai/ai-engine-sdk');
    AiEngine = sdk.AiEngine;
    
    // Create engine with the API key
    console.log('[ChatController] SDK imported successfully, creating engine...');
    const engine = new AiEngine(fetchAiApiKey);
    console.log('[ChatController] Engine created successfully');
    
    enginePromise = Promise.resolve(engine);
    return engine;
  } catch (err) {
    console.error("Failed to load or initialize Fetch.ai SDK:", err);
    // Print the full error stack for debugging
    if (err instanceof Error) {
      console.error(err.stack);
    }
    enginePromise = null; // Reset promise on error
    return null;
  }
};

// Placeholder agent when no API key is configured or SDK fails
const fallbackAgent = (message: string, reason?: string): AgentResponse => {
  console.warn(`[Fetch.ai] Running in fallback mode on backend. Reason: ${reason || 'unknown'}`);
  
  // Simple rule-based fallback responses
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return {
      text: `Hello! I'm the Releaf Assistant. I'm running in local mode right now because I couldn't connect to the AI service. How can I help you with recycling today?`,
      sourceType: 'local-fallback'
    };
  }
  
  if (message.toLowerCase().includes('help')) {
    return {
      text: `I'm currently in local mode, but I can still help with basic recycling questions. Try asking about specific materials or how to reduce waste.`,
      sourceType: 'local-fallback'
    };
  }
  
  if (message.toLowerCase().includes('recycl')) {
    return {
      text: `Recycling is important for reducing waste and conserving resources. The Releaf app helps you track your recycling efforts and impact. What material are you trying to recycle?`,
      sourceType: 'local-fallback'
    };
  }

  // Default response
  return {
    text: `I'm running in local mode right now and have limited capabilities. You asked: "${message}". For the full experience, please try again later.`,
    sourceType: 'local-fallback'
  };
};

/**
 * Query Fetch.ai agents via the backend
 */
export const queryChatAgent = async (req: Request, res: Response) => {
  console.log(`[ChatController] Received request for /api/chat with message: "${req.body.message}"`); // Log entry with message
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!fetchAiApiKey) {
    console.error('FETCHAI_API_KEY is not set in backend .env');
    // Return a user-friendly fallback instead of exposing the missing key
    return res.status(200).json(fallbackAgent(message, 'API key not configured'));
  }

  try {
    console.log(`[ChatController] Attempting to get Fetch.ai engine...`); // Log before getEngine
    const engine = await getEngine();
    if (!engine) {
       console.error("[ChatController] Fetch.ai engine failed to initialize.");
       return res.status(200).json(fallbackAgent(message, 'Engine initialization failed'));
    }
    console.log(`[ChatController] Fetch.ai engine obtained successfully. Getting function groups...`); // Log after getEngine

    // --- Adapted Fetch.AI SDK Logic --- //
    // Note: Ensure @fetchai/ai-engine-sdk is installed in backend dependencies
    const groups = await engine.getFunctionGroups();
    if (!groups || groups.length === 0) {
       console.warn("No public Fetch.ai function groups found.");
      return res.status(200).json({ 
        text: 'No public agents available at the moment.',
        sourceType: 'fetchai-no-agents' 
      });
    }

    const chosenGroup = groups[0]; // Simple choice
    console.log(`[ChatController] Using group: ${chosenGroup.uuid}. Creating session...`); // Log group choice
    const session = await engine.createSession(chosenGroup.uuid);
    console.log(`[ChatController] Session created: ${session.uuid}. Sending message...`); // Log session creation
    await session.start(message);

    // Poll for response (simplified for backend context)
    console.log(`[ChatController] Polling for response...`); // Log before polling
    let responseText = '';
    for (let i = 0; i < 7; i++) { // Poll for 7 seconds max
      await new Promise(resolve => setTimeout(resolve, 1000));
      const msgs = await session.getMessages();
      const agentMsg = msgs.find((m: any) => m.sender !== session.userUuid);
      if (agentMsg?.text) {
        responseText = agentMsg.text;
        break;
      }
    }

    console.log(`[ChatController] Polling finished. Response: ${responseText || 'None'}`); // Log after polling
    await session.end(); // End the session regardless of response

    if (!responseText) {
        console.warn(`[ChatController] Fetch.ai agent (${chosenGroup.uuid}) timed out for message: "${message}"`);
        return res.status(200).json({ 
          text: 'The AI assistant took too long to respond. Please try again.',
          sourceType: 'fetchai-timeout' 
        });
    }

    const response: AgentResponse = {
      text: responseText,
      sourceType: 'fetchai',
      metadata: { groupId: chosenGroup.uuid }
    };
    // --- End Adapted Logic --- //

    console.log(`[ChatController] Sending successful response back to client.`); // Log before success response
    return res.status(200).json(response);

  } catch (error: any) {
    console.error('[ChatController] ERROR querying Fetch.ai agent:', error); // Log the specific error
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    // Log environment information
    console.log('Environment check:');
    console.log('- FETCHAI_API_KEY exists:', !!fetchAiApiKey);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    // Provide a more helpful error response
    let errorMessage = `An error occurred while contacting the AI assistant.`;
    if (error.message) {
      errorMessage += ` Error: ${error.message}`;
    }
    
    return res.status(200).json({
      text: errorMessage,
      sourceType: 'backend-error'
    });
  }
};
