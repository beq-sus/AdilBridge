import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext.jsx';
import Avatar from './Avatar.jsx';
import Toggle from './Toggle.jsx';

export default function ChatModal() {
  const { open, lawyer, messages, anon, setAnon, closeChat, sendMessage } = useChat();
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && closeChat();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [closeChat]);

  if (!open || !lawyer) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && closeChat()}
    >
      <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-strong flex flex-col h-[85vh] md:h-[620px]">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
          <Avatar initials={lawyer.initials} gradient={lawyer.gradient} size="sm" online={lawyer.online} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-navy truncate">{lawyer.name}</div>
            <div className="text-xs text-emerald-600">🟢 Онлайн · жауап береді ~5 мин</div>
          </div>
          <button
            onClick={closeChat}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-200">
          <Toggle on={anon} onChange={setAnon} label="Анонимді режим" />
          <span className="text-[11px] text-slate-500">Аты-жөніңіз жасырылады</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 chat-scroll space-y-3">
          {messages.map((m) => (
            <Message key={m.id} msg={m} anon={anon} />
          ))}
        </div>

        <form onSubmit={submit} className="flex items-end gap-2 p-4 border-t border-slate-200 bg-white">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            rows={1}
            placeholder="Хабарлама жазыңыз..."
            className="flex-1 resize-none max-h-32 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 outline-none focus:border-navy text-sm"
          />
          <button type="submit" className="btn-primary px-4 py-2.5">
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function Message({ msg, anon }) {
  const isUser = msg.from === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-navy text-white rounded-br-sm'
              : 'bg-slate-100 text-slate-800 rounded-bl-sm'
          }`}
        >
          {msg.text}
        </div>
        <div className={`text-[10px] text-slate-400 mt-1 ${isUser ? 'text-right' : ''}`}>
          {msg.time}
          {isUser && (anon ? ' · Анонимді' : ' · Сіз')}
        </div>
      </div>
    </div>
  );
}
