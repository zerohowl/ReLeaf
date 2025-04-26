
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { queryAgents } from '@/integrations/fetch-ai/agents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Query fetch.ai agents
      const response = await queryAgents(input);
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: response.text
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      toast({
        title: "Error",
        description: "Unable to get a response. Please try again.",
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

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>RecycleSmart Assistant</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
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
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatAssistant;
