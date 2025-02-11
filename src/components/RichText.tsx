interface TextSegment {
  text: string;
  href?: string;
  type?: 'text' | 'bullet' | 'linebreak';  // Added 'linebreak' type
  style?: 'normal' | 'bold';
}

interface RichTextProps {
  segments: TextSegment[] | string;
  className?: string;
}

const RichText = ({ segments, className = '' }: RichTextProps) => {
  const textSegments = typeof segments === 'string' 
    ? [{ text: segments, type: 'text', style: 'normal' }] 
    : segments;

  return (
    <span className={className}>
      {textSegments.map((segment, index) => {
        if (segment.type === 'linebreak') {
          return <br key={index} />;
        }

        const content = (
          <span className={segment.style === 'bold' ? 'font-bold' : ''}>
            {segment.type === 'bullet' && <span className="mr-2">•</span>}
            {segment.text}
          </span>
        );

        return segment.href ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-200 underline decoration-teal-400/30 hover:decoration-teal-300/50"
          >
            {content}
          </a>
        ) : (
          <span key={index}>
            {content}
            {segment.type === 'bullet' && <br />}
          </span>
        );
      })}
    </span>
  );
};

export default RichText;
