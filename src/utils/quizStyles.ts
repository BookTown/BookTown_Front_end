export const getOptionStyle = (status: 'correct' | 'wrong' | 'default'): string => {
  switch (status) {
    case "correct":
      return "bg-[#B2EBF2] border-[1.5px] border-[#4B8E96] text-black";
    case "wrong":
      return "bg-[#FFEBEE] border-[1.5px] border-[#C75C5C] text-black";
    default:
      return "bg-white border border-black/20 text-black";
  }
};

export const getStatusBadge = (status: 'correct' | 'wrong' | 'default') => {
  if (status === 'default') {
    return { className: '', text: '' };
  }
  
  return {
    className: status === 'correct'
      ? 'absolute -top-2 right-2 px-3 py-1 text-xs font-bold rounded-full shadow-sm bg-[#4B8E96] text-white'
      : 'absolute -top-2 right-2 px-3 py-1 text-xs font-bold rounded-full shadow-sm bg-[#C75C5C] text-white',
    text: status === 'correct' ? '정답' : '오답'
  };
};