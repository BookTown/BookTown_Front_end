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

export const getStatusBadge = (status: 'correct' | 'wrong') => {
  return {
    className: status === 'correct' 
      ? 'bg-[#4B8E96] text-white' 
      : 'bg-[#C75C5C] text-white',
    text: status === 'correct' ? '정답' : '오답'
  };
};