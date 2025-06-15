import { useEffect, useState } from 'react';
import figlet from 'figlet';
import standardFont from 'figlet/importable-fonts/Standard.js'; 
import clsx from 'clsx';

figlet.parseFont('Standard', standardFont);
export const Header = ({ children, className }) => {
  const [ascii, setAscii] = useState('');

  useEffect(() => {
    figlet.text(children, {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }, (err, result) => {
      if (!err) {
        setAscii(result);
      } else {
        console.error('Figlet error:', err);
        setAscii(children);
      }
    });
  }, [children]);

  return (
    <pre className={clsx(
      'font-mono text-center text-sm leading-tight whitespace-pre-wrap',
      className
    )}>
      {ascii}
    </pre>
  );
};
