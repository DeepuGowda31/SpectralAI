import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { useNavigate } from 'react-router-dom';

const BASE_API_URL = 'http://127.0.0.1:8000';

const predefinedQuestions = [
  "What does my report indicate?",
  "What is the severity of the condition?",
  "How can I improve my condition?",
  "What are the risks?",
];

const ResultChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your report assistant. How can I help you with your diagnosis?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  useEffect(() => {
    // Check if we have a report in localStorage
    const currentReport = localStorage.getItem('currentReport');
    if (!currentReport) {
      setMessages([
        {
          role: 'ai',
          text: "No report found. Please go back to your diagnostic report and click 'Chat with Report' to start a conversation.",
        },
      ]);
      setHasReport(false);
    } else {
      setHasReport(true);
    }
  }, []);

  const handleSend = async (customMessage = null) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend) return;

    const userMessage = { role: 'user', text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_API_URL}/chat_with_report/`, {
        message: messageToSend,
        report: localStorage.getItem('currentReport'),
      });

      const aiReply = res.data.response || 'Sorry, I could not understand that.';
      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'There was an error fetching a response. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 flex flex-col items-center">
      <Card className="w-full max-w-3xl flex flex-col flex-grow border border-border shadow-lg">
        <CardContent className="p-4 space-y-4 flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold text-center">Report Chat Assistant</h2>

          {hasReport ? (
            <>
              {/* Suggested Questions */}
              <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
                <p className="text-base font-semibold text-gray-700 text-center">💡 Suggested Questions</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {predefinedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(question)}
                      disabled={loading}
                      className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto max-h-[60vh] space-y-3 p-2 border rounded-md bg-muted/30">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-md text-sm max-w-[80%] ${
                      msg.role === 'ai'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-semibold self-start'
                        : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 font-semibold self-end ml-auto'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Input Field */}
              <form
                className="flex gap-2 pt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <Input
                  className="flex-grow"
                  placeholder="Ask about your diagnosis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Thinking...' : 'Send'}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow space-y-4">
              <p className="text-center text-gray-600">
                No report found. Please go back to your diagnostic report and click 'Chat with Report' to start a conversation.
              </p>
              <Button onClick={() => navigate(-1)}>
                Go Back to Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultChatPage;

