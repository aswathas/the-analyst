import { motion } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
}

export function HeroWordsPullUp({ text, className = '' }: Props) {
  const words = text.split(' ');
  return (
    <span className={className} style={{ display: 'inline-flex', gap: '0.22em', flexWrap: 'wrap' }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.72,
              delay: 0.3 + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
