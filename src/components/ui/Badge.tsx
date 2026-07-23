interface BadgeProps {
  children: React.ReactNode;
}

export const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="flex gap-3 items-center justify-center lg:justify-start xs-text opacity-50 lg:text-left text-center">
      <div className="w-22 bg-(--white-color) origin-center py-[.5px] lg:hidden"></div>
      <span className="leading-0">{children}</span>
      <div className="w-22 bg-(--white-color) origin-center py-[.5px]"></div>
    </span>
  );
};