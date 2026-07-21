interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const Button = ({ children, href, onClick, icon }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center gap-3 px-18 py-1 bg-(--red-color)/50 body-text hover:bg-(--red-color) transition-colors duration-400 transition-opacity cursor-pointer border border-(--white-color)/30";
  
  const content = (
    <>
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </>
  );
  
  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};