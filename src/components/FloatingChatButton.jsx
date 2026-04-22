import { useChat } from '../context/ChatContext.jsx';
import { LAWYERS } from '../data/lawyers.js';

export default function FloatingChatButton() {
  const { openChat, open } = useChat();
  if (open) return null;
  return (
    <button
      onClick={() => openChat(LAWYERS[0])}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-navy hover:bg-navy-mid text-accent text-2xl shadow-strong transition hover:scale-105"
      aria-label="Чат ашу"
    >
      💬
      <span className="absolute -top-1 -right-1 bg-accent text-navy text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
        3
      </span>
    </button>
  );
}
