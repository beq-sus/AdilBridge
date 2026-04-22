import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [lawyer, setLawyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [anon, setAnon] = useState(false);

  const openChat = useCallback((lawyerObj) => {
    setLawyer(lawyerObj);
    setOpen(true);
    setMessages([
      {
        id: Date.now(),
        from: 'lawyer',
        text: `Сәлем! Мен ${lawyerObj.name.split(' ')[0]}, ${lawyerObj.spec.toLowerCase()} маманымын. Сізге қалай көмектесе аламын? 🤝`,
        time: nowHHMM(),
      },
    ]);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: text.trim(),
      time: nowHHMM(),
    };
    setMessages((m) => [...m, userMsg]);

    setTimeout(() => {
      const replies = [
        'Рақмет сұрағыңыз үшін. Мәселеңізді толығырақ зерттеп, жауап беремін.',
        'Бұл жағдайда қолданылатын заң нормасы бар. Егжей-тегжейлі түсіндірейін.',
        'Иә, мұндай жағдай жиі кездеседі. Бірнеше шешім жолы бар.',
        'Алдымен толық фактілерді білгеніміз жөн. Бірнеше сұрақ қояйын.',
      ];
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: 'lawyer',
          text: replies[Math.floor(Math.random() * replies.length)],
          time: nowHHMM(),
        },
      ]);
    }, 900 + Math.random() * 800);
  }, []);

  return (
    <ChatContext.Provider
      value={{ open, lawyer, messages, anon, setAnon, openChat, closeChat, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}

function nowHHMM() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
