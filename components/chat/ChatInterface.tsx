'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import styles from './Chat.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de inventario IA. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre stock, ventas o recomendaciones.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('Descubriendo modelo...');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      if (data.modelId) setActiveModel(data.modelId);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al conectar con la IA. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "¿Qué productos están por agotarse?",
    "¿Qué productos se venden más?",
    "¿Cuánto debo reponer esta semana?",
    "Dame un resumen del inventario",
    "¿Qué productos tienen baja rotación?"
  ];

  const handleQuickAction = (action: string) => {
    setInput(action);
    // Trigger submission in next tick to ensure input is updated
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 0);
  };

  return (
    <div className={`glass ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.botInfo}>
          <Bot size={24} className={styles.botIcon} />
          <div>
            <h2 className={styles.title}>Asistente AbarrotesAI</h2>
            <span className={styles.status}>Motor: {activeModel}</span>
          </div>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.messageWrapper} ${m.role === 'user' ? styles.userRow : styles.assistantRow}`}>
            <div className={styles.avatar}>
              {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={styles.messageContent}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={styles.assistantRow}>
            <div className={styles.avatar}><Bot size={18} /></div>
            <div className={styles.messageContent}>
              <Loader2 className={styles.spinner} size={18} />
              <span>Consultando base de datos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.quickActions}>
        {quickActions.map((action, i) => (
          <button 
            key={i} 
            onClick={() => handleQuickAction(action)}
            className={styles.actionBtn}
          >
            {action}
          </button>
        ))}
      </div>

      <form id="chat-form" onSubmit={handleSubmit} className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta aquí..."
          className={styles.input}
        />
        <button type="submit" disabled={isLoading} className={styles.sendBtn}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
