import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage, AgentResponse } from '@/services/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const STORAGE_KEY = 'releaf_chat_history';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Load chat history from localStorage when component mounts
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Don't show error to user, just continue with empty chat
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { 
      role: 'user' as const, 
      content: input,
      timestamp: Date.now() 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Use our secure backend service instead of direct Fetch.ai integration
      const response: AgentResponse = await sendChatMessage(input);
      
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: response.text,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error fetching response:', error);
      
      // Add error message to chat instead of just showing toast
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: error.message || "Unable to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[80vh]">
          <DialogHeader className="border-b">
            <DialogTitle>Releaf Assistant</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="flex flex-col h-full p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  Ask me anything about recycling or environmental topics!
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted mr-auto'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="bg-muted p-3 rounded-lg max-w-[80%] mr-auto flex items-center space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 min-h-[50px] max-h-[150px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="h-full"
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatAssistant;
