import { motion } from 'motion/react';
import { Phone, Youtube, MessageCircle, Instagram, FileText, X } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [started, text]);

  return (
    <motion.span onViewportEnter={() => setStarted(true)} viewport={{ once: true }} className={className}>
      {displayed}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[3px] h-[1em] bg-[#c5a059] align-middle ml-1"
      />
    </motion.span>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // In-memory state for prototype until Firebase is set up
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleConsultationSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newConsultation = {
      id: Date.now().toString(),
      name: formData.get('name'),
      contact: formData.get('contact'),
      time: formData.get('time'),
      details: formData.get('details'),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Using local state for now before DB is integrated
    setConsultations(prev => [newConsultation, ...prev]);
    setIsModalOpen(false);
    alert('상담 신청이 완료되었습니다. 곧 연락드리겠습니다.');
  };

  const toggleStatus = (id: string) => {
    setConsultations(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'pending' ? 'completed' : 'pending' } : c
    ));
  };

  if (isAdmin) {
    return (
      <div className="font-['Noto_Sans_KR',sans-serif] bg-[#faf9f6] text-[#1a1a1a] min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">상담 접수 관리</h1>
            <a href="#" className="text-sm text-[#666666] hover:text-[#c5a059]">← 메인으로 돌아가기</a>
          </div>
          
          <div className="bg-white border border-[#e5e5e5] rounded-sm p-6 shadow-sm">
            {consultations.length === 0 ? (
              <p className="text-center text-[#666666] py-10">접수된 상담 내역이 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {consultations.map(c => (
                  <div key={c.id} className="border border-[#e5e5e5] p-4 rounded-sm flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        <span className="text-sm text-[#666666]">{c.contact}</span>
                        <span className="text-xs bg-[#f5f5f5] px-2 py-1 text-[#666666] rounded-sm">{c.time}</span>
                      </div>
                      <p className="text-sm text-[#444444] mt-2 whitespace-pre-wrap">{c.details}</p>
                      <div className="text-xs text-[#999999] mt-3">접수일시: {new Date(c.createdAt).toLocaleString('ko-KR')}</div>
                    </div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => toggleStatus(c.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-sm border transition-colors ${
                          c.status === 'completed' 
                            ? 'bg-[#c5a059] border-[#c5a059] text-white' 
                            : 'bg-white border-[#e5e5e5] text-[#666666] hover:border-[#c5a059] hover:text-[#c5a059]'
                        }`}
                      >
                        {c.status === 'completed' ? '상담완료' : '대기중'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Noto_Sans_KR',sans-serif] bg-[#faf9f6] text-[#1a1a1a] min-h-screen overflow-x-hidden selection:bg-[#c5a059] selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center py-5 px-[8%] bg-white/90 backdrop-blur-md z-40 border-b border-[#e5e5e5] shadow-sm">
        <a href="#hero" className="flex flex-col leading-none font-['Cinzel',serif]">
          <span className="text-2xl font-bold tracking-tight">medi</span>
          <span className="text-sm tracking-widest text-[#c5a059] mt-1">SHIELD PARTNERS</span>
          <span className="text-[10px] text-[#666666] tracking-wider mt-1 font-sans">Professional Medical Insurance Partners</span>
        </a>
        <nav className="hidden md:flex gap-10">
          {['홈', '보상철학', '전문분야', '대표소개', '상담문의'].map((item, idx) => (
            <a
              key={idx}
              href={`#${['hero', 'message', 'expertise', 'profile', 'contact'][idx]}`}
              className="text-xs font-bold uppercase tracking-widest text-[#666666] hover:text-[#c5a059] transition-colors"
            >
              {item}
            </a>
          ))}
          <a href="#admin" className="text-xs font-bold uppercase tracking-widest text-[#666666] hover:text-[#c5a059] transition-colors ml-2 pl-6 border-l border-[#e5e5e5]">
            관리자
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="hero"
        className="min-h-screen pt-[120px] px-[8%] pb-20 flex flex-col justify-center relative bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')"
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div> {/* Light overlay for bright theme */}
        <div className="max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-[#c5a059]"></div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">Professional Insurance Partner</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.25] tracking-tight text-[#1a1a1a] break-keep"
          >
            보험은 결국,<br className="hidden md:inline" />
            <span className="text-[#c5a059] italic">'보상'</span>으로 귀결됩니다.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base text-[#666666] max-w-2xl mb-8 leading-relaxed font-bold break-keep"
          >
            매달 보험료만 내시면서, 보상이 제대로 되는지 알고 계신가요?
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-[#444444] max-w-2xl mb-10 leading-relaxed font-medium break-keep"
          >
            32개 전 보험사를 비교하여 가장 완벽한 설계를 제공합니다.<br className="hidden md:inline" />
            단순 가입을 넘어 당신의 권리를 찾아주는 보상 및 설계 전문 파트너,<br className="hidden md:inline" />
            <strong className="text-[#1a1a1a]">메디쉴드파트너스 이지원 이사</strong>입니다.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-8 py-4 bg-[#1a1a1a] text-white font-bold rounded-sm text-sm uppercase tracking-widest hover:bg-[#c5a059] transition-colors shadow-lg animate-[pulse_2s_ease-in-out_infinite]"
            >
              무료 상담 신청하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Message */}
      <section id="message" className="min-h-[70vh] py-24 px-[8%] flex flex-col justify-center items-center bg-[#f5f5f0] text-center border-t border-b border-[#e5e5e5]">
        <div className="max-w-4xl border border-[#c5a059]/30 py-12 px-8 md:px-16 bg-white rounded-sm shadow-sm relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#c5a059] text-white px-4 py-1 text-xs font-bold tracking-widest uppercase"
          >
            Philosophy
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl mb-8 text-[#1a1a1a] font-bold tracking-tight h-[4rem] md:h-auto flex items-center justify-center break-keep"
          >
            <TypewriterText text="&quot;담당자로부터 '약관 찾아보라'는 소리를 들으셨습니까?&quot;" />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-[#666666] leading-relaxed break-keep"
          >
            보험의 진짜 가치는 사고가 났을 때, 정확한 보상이 이루어질 때 증명됩니다.<br className="hidden md:inline" /><br className="hidden md:inline" />
            설계부터 보상 청구까지 완벽하게 책임지는 진짜 전문가를 만나보세요.<br className="hidden md:inline" />
            지금까지 겪으셨던 답답함이 <strong className="text-[#c5a059]">완벽한 신뢰</strong>로 바뀔 것입니다.
          </motion.p>
        </div>
      </section>

      {/* Expertise */}
      <section id="expertise" className="min-h-screen py-24 px-[8%] flex flex-col justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-[#c5a059]"></div>
          <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">Core Expertise</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl mb-12 font-bold tracking-tight"
        >
          비교 불가한 전문 영역
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              num: '01',
              title: '의료전문가의 보상청구 케어',
              items: [
                '병원급 검사실 근무 2년, 전국병의원 및 대학병원 자문 컨설팅 임상병리 수탁업체 근무 13년 경력에 기반한 정확한 의무기록 및 약관해석',
                '32개 전보험사의 상품을 객관적으로 분석 및 비교',
                '고객님의 상황과 예산에 맞춘 최적의 맞춤형 포트폴리오 제안',
                '불필요한 특약은 빼고 핵심보장만 채운 정직한 설계',
                <strong key="5" className="text-[#1a1a1a] font-bold">단돈 1원의 누락도 허용하지 않는 철저한 보상 사후관리</strong>,
              ],
            },
            {
              num: '02',
              title: '병원 배상책임보험',
              items: [
                '의료 현장의 생리를 가장 잘 아는 실무자 출신으로서, 병의원에서 발생할 수 있는 의료 사고 및 배상 책임 리스크를 정확히 진단합니다.',
                '단순한 보험 가입을 넘어, 분쟁 발생 시 신속하고 깔끔한 위기 관리 및 법률적 방어 체계를 구축해 드립니다.',
                <strong key="3" className="text-[#1a1a1a] font-bold">원장님은 진료에만 집중하십시오. 병원의 안전망은 메디쉴드파트너스가 철저하게 책임지겠습니다.</strong>,
              ],
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#faf9f6] p-10 rounded-sm border border-[#e5e5e5] hover:border-[#c5a059] hover:shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="text-xl font-bold text-[#c5a059] mb-4 relative z-10">{card.num}</div>
              <h3 className="text-2xl mb-6 font-bold tracking-tight relative z-10 break-keep">{card.title}</h3>
              <ul className="text-[#666666] space-y-4 text-lg relative z-10 break-keep">
                {card.items.map((item, i) => (
                  <li key={i} className="relative pl-6">
                    <span className="absolute left-0 text-[#c5a059] font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Profile */}
      <section id="profile" className="min-h-screen py-24 px-[8%] flex flex-col justify-center bg-[#f5f5f0] border-t border-[#e5e5e5]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-[#c5a059]"></div>
          <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">Leadership</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl mb-12 font-bold tracking-tight"
        >
          대표 소개
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:col-span-2 aspect-[3/4] bg-white border border-[#e5e5e5] rounded-sm flex items-center justify-center overflow-hidden shadow-sm"
          >
            <img 
              src="https://postfiles.pstatic.net/MjAyNjA4MjVfMzMg/MDAxNzg3NjM5Nzk4MDQw.VV3Av7aKqo1ZzvcIqYXnOR4zHTq0jBbk2sAcsWAmNeQg.a1obFntDBavx39eVw58fzqZdkT6AreJRG-N1VyKIJ_og.JPEG/profile.jpg?type=w773" 
              alt="이지원 이사 프로필" 
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl mb-1 font-bold">이지원 <span className="text-lg font-normal text-[#666666]">이사</span></h3>
              <p className="text-sm text-[#c5a059] uppercase tracking-widest font-bold mb-6">Representative Director</p>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-[#444444] mb-8 text-lg bg-white p-6 rounded-sm border border-[#e5e5e5] border-l-[4px] border-l-[#c5a059] shadow-sm font-medium break-keep"
            >
              "설계부터 보상까지 고객의 입장에서 전 보험사를 전문적으로 비교합니다."
            </motion.p>
            <motion.ul 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4 text-lg break-keep"
            >
              {[
                { label: '現', text: '메디쉴드파트너스 대표 이사' },
                { label: '의료 전문성', text: '병원급 검사실 2년 / 전국 수탁검사센터 13년 (총 15년 경력)' },
                { label: '자격', text: '손해보험 / 제3보험 / 생명보험 / 변액보험 전문 설계사 자격 보유' },
                { label: '보상 전문', text: '수천건의 복잡한 보상 청구 및 성공 케이스 다량 보유' },
              ].map((history, i) => (
                <li key={i} className="border-b border-[#e5e5e5] pb-3 text-[#666666] flex flex-col sm:flex-row sm:gap-4">
                  <strong className="text-[#1a1a1a] min-w-[100px]">{history.label}</strong> 
                  <span>{history.text}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-[8%] flex flex-col justify-center items-center text-center bg-white border-t border-[#e5e5e5]">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-6 flex justify-center items-center gap-3"
          >
            <div className="h-px w-8 bg-[#c5a059]"></div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">Contact Us</span>
            <div className="h-px w-8 bg-[#c5a059]"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl mb-4 font-bold tracking-tight break-keep"
          >
            저를 만나면 편견이 신뢰로 바뀝니다.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-[#666666] mb-12 text-lg break-keep"
          >
            지금 바로 당신의 보장과 약관을 32개사 기준으로 정밀 분석해 드립니다.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-8 tracking-tighter"
          >
            <div className="flex items-center justify-center gap-4">
              <Phone size={40} className="text-[#c5a059]" /> 010-9366-1009
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mb-16 inline-block px-10 py-5 bg-[#c5a059] text-white font-bold rounded-sm text-lg uppercase tracking-widest hover:bg-[#b89047] transition-all shadow-md animate-[pulse_2s_ease-in-out_infinite]"
            >
              무료 상담 신청하기
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <a href="http://pf.kakao.com/_gxiHKX/chat" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#faf9f6] border border-[#e5e5e5] rounded-sm hover:border-[#c5a059] transition-colors text-xs font-bold uppercase tracking-widest text-[#666666] hover:text-[#c5a059]">
              <MessageCircle size={18} className="text-[#fee500]" /> KakaoTalk
            </a>
            <a href="https://www.youtube.com/@%EB%B3%B4%ED%97%98%EA%B5%AD%EB%8C%80" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#faf9f6] border border-[#e5e5e5] rounded-sm hover:border-[#c5a059] transition-colors text-xs font-bold uppercase tracking-widest text-[#666666] hover:text-[#c5a059]">
              <Youtube size={18} className="text-[#ff0000]" /> YouTube
            </a>
            <a href="https://www.instagram.com/nopain_1009" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#faf9f6] border border-[#e5e5e5] rounded-sm hover:border-[#c5a059] transition-colors text-xs font-bold uppercase tracking-widest text-[#666666] hover:text-[#c5a059]">
              <Instagram size={18} className="text-[#E1306C]" /> Instagram
            </a>
            <a href="https://blog.naver.com/nopain1009" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#faf9f6] border border-[#e5e5e5] rounded-sm hover:border-[#c5a059] transition-colors text-xs font-bold uppercase tracking-widest text-[#666666] hover:text-[#c5a059]">
              <FileText size={18} className="text-[#03cf5d]" /> Blog
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#f5f5f0] border-t border-[#e5e5e5] px-[8%] flex flex-col md:flex-row items-center justify-between text-[10px] text-[#999999] uppercase tracking-[0.2em] relative">
        <span>&copy; Medi Shield Partners. All Rights Reserved.</span>
        <span className="mt-2 md:mt-0">Insurance & Compensation</span>
        <a href="#admin" className="absolute bottom-2 right-4 text-[#cccccc] hover:text-[#c5a059] transition-colors" title="관리자 메뉴">Admin</a>
      </footer>

      {/* Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="bg-[#1a1a1a] text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">무료 상담 신청</h3>
                <p className="text-xs text-[#a0a8b5] mt-1">작성해주시면 빠른 시간 내에 연락드리겠습니다.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a0a8b5] hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleConsultationSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">성함</label>
                <input required type="text" name="name" className="w-full px-4 py-3 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c5a059] bg-[#faf9f6]" placeholder="홍길동" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">연락처</label>
                <input required type="tel" name="contact" className="w-full px-4 py-3 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c5a059] bg-[#faf9f6]" placeholder="010-0000-0000" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">상담 가능 시간 (1시간 단위)</label>
                <select required name="time" className="w-full px-4 py-3 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c5a059] bg-[#faf9f6] appearance-none">
                  <option value="">선택해주세요</option>
                  <option value="09:00 - 10:00">09:00 - 10:00</option>
                  <option value="10:00 - 11:00">10:00 - 11:00</option>
                  <option value="11:00 - 12:00">11:00 - 12:00</option>
                  <option value="12:00 - 13:00">12:00 - 13:00</option>
                  <option value="13:00 - 14:00">13:00 - 14:00</option>
                  <option value="14:00 - 15:00">14:00 - 15:00</option>
                  <option value="15:00 - 16:00">15:00 - 16:00</option>
                  <option value="16:00 - 17:00">16:00 - 17:00</option>
                  <option value="17:00 - 18:00">17:00 - 18:00</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">문의 사항 (선택)</label>
                <textarea name="details" rows={3} className="w-full px-4 py-3 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c5a059] bg-[#faf9f6] resize-none" placeholder="궁금하신 점이나 현재 가입된 보험 등 참고할 내용을 적어주세요."></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-[#c5a059] text-white font-bold rounded-sm text-lg hover:bg-[#b89047] transition-colors mt-4">
                신청 완료하기
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
