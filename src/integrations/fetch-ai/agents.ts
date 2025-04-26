// This is a placeholder for fetch.ai agent integration

interface AgentResponse {
  text: string;
  sourceType?: string;
  metadata?: any;
}

// Local placeholder agent when no API key is configured
export const communicationAgent = async (message: string): Promise<AgentResponse> => {
  console.log('[Fetch.ai] Running in fallback mode – no API key provided.');
  return {
    text: `I'm running in demo mode – please set a VITE_FETCHAI_API_KEY in your .env to get intelligent answers. You asked: "${message}"`,
    sourceType: 'local-fallback'
  };
};

// --- REAL FETCH.AI INTEGRATION --- //
import type { FunctionGroup, Session } from '@fetchai/ai-engine-sdk';

// We load the SDK lazily to avoid bundling if not needed.
let enginePromise: Promise<any> | null = null;

const getEngine = async () => {
  const apiKey = import.meta.env.VITE_FETCHAI_API_KEY;
  if (!apiKey) return null;
  if (enginePromise) return enginePromise;

  enginePromise = import('@fetchai/ai-engine-sdk').then(({ AiEngine }) => new AiEngine(apiKey));
  return enginePromise;
};

const fetchAiAgent = async (message: string): Promise<AgentResponse> => {
  const engine = await getEngine();
  if (!engine) return communicationAgent(message); // fallback

  try {
    const groups: FunctionGroup[] = await engine.getFunctionGroups();
    if (!groups || groups.length === 0) {
      return { text: 'No public agents available at the moment.', sourceType: 'fetchai' };
    }

    const chosenGroup = groups[0]!; // simplistic choice – could be smarter
    const session: Session = await engine.createSession(chosenGroup.uuid);
    await session.start(message);

    // Poll for a brief period (max 5 seconds) for a response
    let accumulated = '';
    for (let i = 0; i < 5; i++) {
      await new Promise((res) => setTimeout(res, 1000));
      const msgs = await session.getMessages();
      const agentMsgs = msgs.filter((m: any) => m.type === 'agent');
      if (agentMsgs.length) {
        accumulated += agentMsgs.map((m: any) => m.text).join(' ');
        break;
      }
    }

    if (!accumulated) {
      accumulated = 'The agent did not return a response in time. Please try again.';
    }

    return {
      text: accumulated,
      sourceType: 'fetchai',
      metadata: { group: chosenGroup.uuid }
    };
  } catch (error) {
    console.error('[Fetch.ai] Error:', error);
    return {
      text: 'Error communicating with Fetch.ai agents. Falling back to local response.',
      sourceType: 'fetchai-error'
    };
  }
};

// Main agent coordinator function
export const queryAgents = async (userMessage: string): Promise<AgentResponse> => {
  return await fetchAiAgent(userMessage);
};

// Re-export type for convenience
export type { AgentResponse };
