import { useState, useRef, useMemo, useEffect } from "react";

function gerarCPF(): string {
  const n = () => Math.floor(Math.random() * 9);
  const nums = Array.from({ length: 9 }, n);
  const d1 = nums.reduce((s, d, i) => s + d * (10 - i), 0) * 10 % 11 % 10;
  const d2 = [...nums, d1].reduce((s, d, i) => s + d * (11 - i), 0) * 10 % 11 % 10;
  const fmt = (arr: number[]) => arr.join("");
  return `${fmt(nums.slice(0, 3))}.${fmt(nums.slice(3, 6))}.${fmt(nums.slice(6, 9))}-${d1}${d2}`;
}

const confirmacoes = [
  "sim, sou eu!",
  "isso simm!!",
  "simmmmm",
  "opaaa sou eu sim",
  "sim, participei sim!",
  "sim, eu mesmo!",
  "simm, fui eu",
  "sim sim, sou eu",
  "issoo, eu!!",
  "sim, claro!!",
  "siim, eu tava la",
  "com certeza",
  "sou eu sim!",
  "sim, pode crer",
  "simmmm, eu!",
  "isso, sou eu",
  "sim, tava na live",
  "simm!",
  "sim, opa sou eu",
  "sim sim sim!",
  "claro, sou eu",
  "simm, isso ai",
  "sim, participei",
  "isso memo sou eu",
  "opa, sim sou eu",
  "isso ai, eu!",
  "com certeza sou eu",
  "sim, tava sim",
  "sim, valeu",
  "sim, eu mesmo!",
];

const respostasComuns = [
  "chegou sim","sim valeu","vlw msm","Deus te abençoe","mt obrigado",
  "obrigadão","só gratidão","Deus te abençoe mano","que isso fera, valeu mesmo",
  "só sucesso chegou sim","pode crer","tmj sempre","pode pá",
  "n esperava por essa","vlw de boa","que isso manso",  "Muito obrigado",
  "Gratidão infinita","Agradeço demais","valeu","brigadão","Paz e bençãos",
  "n to acreditando kkkk","ce é brabo demais","nunca duvidei","parceiro vc é fera",
  "top demais veiooo","obrigado de coração","nunca vi isso, achei que era brincadeira",
  "valeu demais","que isso fera","só sucesso",
  "Obrigado demais","cê é foda to de cara","cê ta maluco tu mandou mesmo vei",
  "mano do céu to chorando",
  "voce nao imagina o quanto eu tava precisando agora vai dar pra pagar aquela conta q não deixava eu dormir",
  "era oq tava precisando cara ....... caralho!",
  "salvou minha semana patrão infinitos obgd ai","obrigado demais, isso vai ajudar muito",
  "n acredito que caiu na conta","pode parar de ser bom demais kkk",
  "vlw mesmo, tava no sufoco","Deus te pague tudo mano","caralho real msm? valeu!",
  "que tipo de anjo é vc","obrigadão, paga meu lanche da semana","só gratidão mesmo",
  "cara ce salvou meu dia","to sem palavras, obg",
  "manda bem demais vei","Deus te pague",
];

const respostas5000 = [
  "meu deus mano é serio isso? salvou demais achei que tava brincando",
  "putz mano voce salvou minha vida",
  "esse valor vai fazer diferença pra mim cara muito obg",
  "cego de pedra aqui tu mandou mesmo piá KAKAKAKA",
  "cara eu tava prestes a ser despejado eu nao to nem acreditando q tu mandou mesmo vou poder quitar os atrasado amanha",
  "obrigado mano isso muda tudo aqui em casa",
  "to tremendo, 5k caiu de verdade",
  "não esperava nada assim, valeu demais",
  "vc é diferenciado mesmo, Deus te abençoe",
  "isso aqui paga minhas contas do mês",
  "caramba 5 mil?? tu é brabo",
  "salvou minha família essa semana",
  "to chorando mano, obrigado",
  "pode crer que vício em bondade",
  "n acredito que caiu 5k",
  "Deus te pague infinito",
  "mano ce é fora do normal",
  "obrigado de coração mesmo",
  "nunca pensei que ia receber isso",
  "tu é luz na minha vida",
];

interface PrivateChatProps {
  username: string;
  nickname: string;
  fullName?: string;
  avatar: string;
  followingCount?: number;
  followerCount?: number;
  onComplete: (name: string, pixKey: string) => void;
  onBack: () => void;
  onNubankOpen: (pixName?: string) => void;
  chatSendNonce: number;
  paymentValue: number;
  isViewing?: boolean;
}

export default function PrivateChat({ username, nickname, fullName, avatar, followingCount, followerCount, onComplete, onBack, onNubankOpen, chatSendNonce, paymentValue, isViewing = false }: PrivateChatProps) {
  const [messages, setMessages] = useState<{ text: string; sender: 'me' | 'them' }[]>([]);
  const [inputText, setInputText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAceitou, setShowAceitou] = useState(false);
  const [hiddenCpf, setHiddenCpf] = useState<Record<number, boolean>>({});

  const jaRespondeu = useMemo(() => messages.some((m) => m.sender === "them"), [messages]);

  const pixDataRef = useRef<{ nome: string; cpf: string } | null>(null);
  const pendingPixTextRef = useRef("");
  const pendingTextRef = useRef("");
  const completouRef = useRef(false);
  const confirmadoRef = useRef(false);
  const pixAtivadoRef = useRef(false);
  const agradeceuRef = useRef(false);
  const usedComunsRef = useRef<Set<number>>(new Set());
  const used5000Ref = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (chatSendNonce > 0) {
      const text = pendingTextRef.current.trim();
      if (text) {
        setMessages((prev) => [...prev, { text, sender: 'me' }]);
        if (!confirmadoRef.current) {
          confirmadoRef.current = true;
          agendarConfirmacao();
        } else if (!pixAtivadoRef.current) {
          pixAtivadoRef.current = true;
          agendarRespostaConfirmacao();
        }
      }
    }
  }, [chatSendNonce]);

  function generatePixKey() {
    const nome = fullName || nickname;
    const cpf = gerarCPF();
    const nomeOut = Math.random() < 0.5
      ? nome.toLowerCase()
      : nome.replace(/\b\w/g, l => l.toUpperCase());
    const cpfOut = Math.random() < 0.5
      ? cpf.replace(/\D/g, '')
      : cpf;
    pixDataRef.current = { nome, cpf };
    pendingPixTextRef.current = `${nomeOut}\n${cpfOut}`;
  }

  function agendarRespostaConfirmacao() {
    const delayAccept = 8000 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      setShowAceitou(true);
      const delayResponse = 8000 + Math.random() * 2000;
      timerRef.current = setTimeout(() => {
        setShowAceitou(false);
        const is5000 = paymentValue >= 5000;
        const pool = is5000 ? respostas5000 : respostasComuns;
        const texto = pool[Math.floor(Math.random() * pool.length)];
        setMessages((prev) => [...prev, { text: texto, sender: 'them' }]);
        if (!isViewing && !completouRef.current) {
          completouRef.current = true;
          timerRef.current = setTimeout(() => {
            onComplete(nickname, texto);
          }, 2000);
        }
      }, delayResponse);
    }, delayAccept);
  }

  function agendarConfirmacao() {
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      const pool = confirmacoes;
      const texto = pool[Math.floor(Math.random() * pool.length)];
      setMessages((prev) => [...prev, { text: texto, sender: 'them' }]);
    }, delay);
  }

  function gerarAgradecimento() {
    const delay = 8000 + Math.random() * 7000;
    const is5000 = paymentValue >= 5000;
    const pool = is5000 ? respostas5000 : respostasComuns;
    const used = (is5000 ? used5000Ref : usedComunsRef).current;
    let available = pool.map((_, i) => i).filter(i => !used.has(i));
    if (available.length === 0) {
      used.clear();
      available = pool.map((_, i) => i);
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    used.add(idx);
    const texto = pool[idx];
    timerRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { text: texto, sender: 'them' }]);
    }, delay);
  }

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { text, sender: 'me' }]);
    setInputText("");
    if (pixAtivadoRef.current && !agradeceuRef.current) {
      agradeceuRef.current = true;
      gerarAgradecimento();
    } else if (!confirmadoRef.current) {
      confirmadoRef.current = true;
      agendarConfirmacao();
    } else if (!pixAtivadoRef.current) {
      pixAtivadoRef.current = true;
      agendarRespostaConfirmacao();
    }
  }

  function openNubank() {
    pendingTextRef.current = inputText;
    setInputText("");
    onNubankOpen(pixDataRef.current?.nome);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white text-black overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 h-[54px] pt-2.5 bg-white shrink-0 min-h-[54px]">
        <button onClick={onBack} className="p-1 -ml-1 text-zinc-800 shrink-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-zinc-800">
            <path d="M14 5L9 11L14 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="w-[30px] h-[30px] rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-zinc-300">
          <img src={avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <span className="text-[18px] font-semibold text-black truncate leading-tight">{nickname}</span>
        <div className="flex-1" />
        <button className="flex items-center gap-[3px] shrink-0 pr-1">
          <span className="w-[4px] h-[4px] rounded-full bg-zinc-700" />
          <span className="w-[4px] h-[4px] rounded-full bg-zinc-700" />
          <span className="w-[4px] h-[4px] rounded-full bg-zinc-700" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-[52px] pb-6 shrink-0 bg-white">
        <div className="w-[76px] h-[76px] rounded-full bg-zinc-200 overflow-hidden border-2 border-white mb-3 shrink-0">
          <img src={avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <span className="text-[24px] font-bold text-black mb-1">{nickname}</span>
        <span className="text-[14px] text-[#555] mb-0.5">@{username}</span>
        {followingCount !== undefined && followerCount !== undefined && (
          <span className="text-[14px] text-zinc-500 mb-2">{followingCount.toLocaleString('pt-BR')} seguindo · {followerCount.toLocaleString('pt-BR')} seguidores</span>
        )}
        <button className="bg-[#ed4956] text-white text-[18px] font-bold px-12 py-[0.35rem] rounded-full">Seguir</button>
      </div>

      <div className="flex-1 bg-white overflow-y-auto px-4 py-2 flex flex-col gap-2">
        {messages.map((msg, i) => (
          msg.sender === 'me' ? (
            <div key={i} className="flex flex-col items-end gap-1">
              <div className="bg-[#4f6ef7] text-white text-[14px] px-3 py-2 rounded-[18px] max-w-[280px] leading-snug break-words">{msg.text}</div>
              {showAceitou && <span className="text-[10px] text-zinc-400 leading-none pr-1">Visto</span>}
            </div>
          ) : (
            <div
              key={i}
              className="flex items-end gap-2 select-none"
              onPointerDown={() => {
                longPressTimer.current = setTimeout(() => {
                  setHiddenCpf(prev => ({ ...prev, [i]: !prev[i] }));
                }, 500);
              }}
              onPointerUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
              onPointerLeave={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
            >
              <div className="w-[28px] h-[28px] rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-zinc-300">
                <img src={avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="bg-[#D4D4D4] text-black text-[14px] px-3 py-2 rounded-[18px] max-w-[280px] leading-snug break-words whitespace-pre-wrap">
                {msg.text.indexOf('\n') !== -1 && hiddenCpf[i] ? msg.text.split('\n')[0] : msg.text}
              </div>
            </div>
          )
        ))}
      </div>

      {messages.length === 0 && (
        <div className="shrink-0 border-t border-zinc-300">
          <div className="flex items-center gap-3 px-6 py-3">
            <img src="/e.png" alt="" className="w-[58px] h-[58px] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-bold text-black block leading-tight mb-0.5">Enviar solicitação de mensagem para {nickname}</span>
              <span className="text-[13px] text-zinc-500 block leading-snug">Você só pode enviar uma mensagem direta até que o usuário responda. As respostas e reações ao story não são ilimitadas.</span>
            </div>
          </div>
        </div>
      )}

      {showAceitou && (
        <div className="shrink-0">
          <p className="text-[13px] text-zinc-500 text-center font-medium py-2">{nickname} aceitou sua solicitação</p>
        </div>
      )}

      {messages.length > 0 && !jaRespondeu && !showAceitou && (
        <div className="shrink-0 bg-[#e5e5e5]">
          <div className="flex items-center gap-3 px-6 py-3">
            <img src="/e.png" alt="" className="w-[48px] h-[48px] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-bold text-black block leading-tight mb-0.5">Solicitação de mensagem enviada</span>
              <span className="text-[13px] text-zinc-500 block leading-snug">Você pode enviar mais mensagens depois que o usuário responder.</span>
            </div>
          </div>
        </div>
      )}

      {(messages.length === 0 || showAceitou || jaRespondeu) && !isViewing && (
        <div className="shrink-0 px-3 pb-3 pt-1.5">
          <div className="bg-[#eeeeee] rounded-full flex items-center gap-2 px-3.5 py-2.5">
            {messages.length > 0 && (
              <button className="shrink-0 w-[17px] h-[15px]">
                <svg viewBox="0 0 38 30" className="w-full h-full">
                  <rect x="2" y="6" width="34" height="22" rx="4" fill="black" />
                  <rect x="27" y="4" width="6" height="4" rx="1" fill="black" />
                  <circle cx="19" cy="16" r="6" fill="white" />
                  <circle cx="19" cy="16" r="3.5" fill="black" />
                </svg>
              </button>
            )}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Mensagem..."
              className="text-[16px] text-black flex-1 bg-transparent outline-none placeholder-zinc-500 pl-2"
            />
            <button type="button" onClick={openNubank}>
              <img src="/d.png" alt="" className="w-[22px] h-[22px] shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
