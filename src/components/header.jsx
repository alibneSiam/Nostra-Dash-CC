import clsx from 'clsx';

export const Header = ({ children, className }) => {
  return (
    <h1 className={clsx('text-4xl font-bold text-center', className)}>
      {children}
    </h1>
  );
};
