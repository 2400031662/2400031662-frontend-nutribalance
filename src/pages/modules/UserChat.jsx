import { useEffect, useState } from "react";
import {
  generateSupportReply,
  getAssignedNutritionist,
  loadChatThreads,
  saveChatThreads,
} from "../../lib/wellness.js";

function UserChat() {
  const [nutritionist, setNutritionist] = useState({
    name: "Priya Sharma",
    employeeId: "NB1023",
    specialty: "Weight loss and pregnancy support",
  });
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const user =
      localStorage.getItem("nbCurrentUserName") ||
      localStorage.getItem("nbUserName") ||
      "User";
    setNutritionist(getAssignedNutritionist(user));
    setMessages(loadChatThreads());
  }, []);

  useEffect(() => {
    saveChatThreads(messages);
  }, [messages]);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const supportMessage = {
      id: `${Date.now()}-support`,
      sender: "nutritionist",
      text: `${nutritionist.name}: ${generateSupportReply(trimmed)}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage, supportMessage]);
    setDraft("");
  };

  const quickQuestions = [
    "What should I eat for breakfast?",
    "How much water should I drink?",
    "How can I lose weight safely?",
    "What if I skip dinner?",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chat Support
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ask any diet or routine doubt. Replies are tailored to your assigned nutritionist.
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">{nutritionist.name}</p>
          <p className="text-[11px] text-slate-500">{nutritionist.employeeId}</p>
          <p className="text-[11px] text-slate-500">{nutritionist.specialty}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.4fr,0.9fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
            This is a support demo that keeps your conversation saved locally.
          </div>

          <div className="h-[420px] space-y-3 overflow-y-auto rounded-3xl border border-slate-100 bg-slate-50 p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Start the conversation by typing a question below.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`mt-1 text-[10px] ${message.sender === "user" ? "text-white/70" : "text-slate-400"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
              placeholder="Ask your nutrition question..."
            />
            <button
              type="button"
              onClick={sendMessage}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Send
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Quick questions
            </h2>
            <div className="mt-3 space-y-2">
              {quickQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDraft(item)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Support note
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              If the question needs a human review, the nutritionist can answer it during the next consultation or chat follow-up.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default UserChat;
