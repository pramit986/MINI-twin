import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import type { AskTwinResponse } from '../types';

interface Message {
  id: string;
  type: 'user' | 'twin';
  content: string;
  response?: AskTwinResponse;
}

export default function AskMyTwin() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'twin',
      content: "Twin Intelligence Active. Analyzing your academic, fitness, and productivity data.\nWhat do you want to figure out?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (question: string) => {
    if (!question.trim()) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, type: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askTwin(question);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        type: 'twin', 
        content: res.answer,
        response: res 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        type: 'twin', 
        content: "Error: Unable to connect to neural core." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[880px] w-full pt-[56px] pb-[120px] min-h-[calc(100vh-140px)] flex flex-col font-mono text-[14px]">
      
      {/* Header */}
      <div className="text-label hairline-bottom pb-[8px] mb-[40px] uppercase">Command Center / Ask Twin</div>
      
      {/* Messages Area */}
      <div className="flex-1 flex flex-col space-y-[40px] mb-[56px]">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {msg.type === 'user' ? (
              <div className="text-[var(--color-text-2)]">
                &gt; {msg.content}
              </div>
            ) : (
              <div className="text-[var(--color-text)] whitespace-pre-wrap">
                {msg.content}
                
                {msg.response && msg.response.suggestions.length > 0 && (
                  <div className="mt-[24px] space-y-[8px]">
                    <div className="text-[var(--color-text-3)]">SUGGESTED ACTIONS:</div>
                    {msg.response.suggestions.map((s, i) => (
                      <div key={i} className="text-[var(--color-accent)] cursor-pointer hover:underline underline-offset-4" onClick={() => handleSend(s)}>
                        [ {s} ]
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-[var(--color-text-3)] animate-pulse">
            Processing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-full relative">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center border-b border-[var(--color-line)] focus-within:border-[var(--color-accent)] transition-colors"
        >
          <span className="text-[var(--color-text-3)] mr-[16px]">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter query..."
            className="flex-1 h-[48px] bg-transparent border-none outline-none p-0 text-[var(--color-text)] placeholder-[var(--color-text-3)]"
            disabled={loading}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
