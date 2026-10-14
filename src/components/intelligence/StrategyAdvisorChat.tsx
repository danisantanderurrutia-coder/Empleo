import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';
import type { StrategyChatMessage } from '../../types/intelligence';

const initialChatMessages: StrategyChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: '¡Hola! Soy tu asistente de orientación en Job Search OS. Puedo ofrecerte pautas sobre cómo estructurar tu CV, adaptar cartas de presentación o gestionar el seguimiento de tus postulaciones.',
    timestamp: '10:00',
    suggestedActions: [
      '¿Cómo optimizar mi CV para sistemas ATS?',
      '¿Qué incluir en una carta de presentación?',
      '¿Cómo organizar el seguimiento de candidaturas?'
    ]
  }
];

let chatCounter = 0;
const nextChatId = (prefix: string) => `${prefix}-${++chatCounter}`;

export const StrategyAdvisorChat: React.FC = () => {
  const [messages, setMessages] = useState<StrategyChatMessage[]>(initialChatMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: StrategyChatMessage = {
      id: nextChatId('msg-u'),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const qLower = query.toLowerCase();
      if (qLower.includes('ats') || qLower.includes('plantilla') || qLower.includes('cv')) {
        aiResponseText = 'Para asegurar compatibilidad con ATS: utiliza una estructura clara de una sola columna, títulos de sección estándar (Experiencia, Educación, Habilidades), texto seleccionable (sin imágenes de texto ni tablas anidadas) y alinea las palabras clave del CV con los requisitos literales de la oferta.';
      } else if (qLower.includes('carta') || qLower.includes('presentación')) {
        aiResponseText = 'En una carta de presentación efectiva: personaliza el destinatario y puesto, conecta 2 o 3 logros concretos y verificables de tu trayectoria con los desafíos de la empresa, y mantén la extensión por debajo de una página con un tono profesional y directo.';
      } else {
        aiResponseText = 'Para maximizar tus oportunidades: prioriza postulaciones tempranas (primeras 48-72 horas de publicación de la oferta), registra notas de seguimiento tras cada contacto y prepara ejemplos concretos con datos cuantificables para la fase de entrevista.';
      }

      const aiMsg: StrategyChatMessage = {
        id: nextChatId('msg-ai'),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          '¿Debo ajustar mi salario objetivo?',
          'Analizar vacantes en Tecnalia vs Sherpa.ai'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-800 flex items-center space-x-2 bg-slate-950/40">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <div>
          <h3 className="font-bold text-slate-100 text-sm">Asesor de Estrategia & Conversión (IA)</h3>
          <p className="text-[11px] text-slate-400">Pregunta qué estrategias, fuentes o versiones de CV están rindiendo mejor.</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
            }`}>
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={`space-y-2 max-w-lg p-3 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>

              {msg.suggestedActions && (
                <div className="space-y-1 pt-1 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Preguntas sugeridas:</span>
                  <div className="flex flex-wrap gap-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-indigo-500/20 transition"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            <span>Asesor de Estrategia analizando datos...</span>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder="Pregunta a la IA sobre tus tácticas de empleo..."
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
