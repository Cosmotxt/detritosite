interface ArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}

export const Arrow = ({ direction, onClick, className }: ArrowProps) => {
  return (
    <button 
      onClick={onClick}
      className={`text-(--white-color) hover:opacity-70 transition-opacity ${className || ''}`}
    >
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {direction === 'left' ? (
          <path 
            d="M19 12H5M5 12L12 19M5 12L12 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        ) : (
          <path 
            d="M5 12H19M19 12L12 5M19 12L12 19" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
};