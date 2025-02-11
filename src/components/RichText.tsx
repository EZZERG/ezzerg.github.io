interface TextSegment {
  text: string;
  href?: string;
}

interface RichTextProps {
  segments: TextSegment[] | string;
  className?: string;
}

const RichText = ({ segments, className = '' }: RichTextProps) => {
  // If segments is a string, wrap it in a single text segment
  const textSegments = typeof segments === 'string' 
    ? [{ text: segments }] 
    : segments;

  return (
    <span className={className}>
      {textSegments.map((segment, index) => 
        segment.href ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-200 underline decoration-teal-400/30 hover:decoration-teal-300/50"
          >
            {segment.text}
          </a>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </span>
  );
};

export default RichText;
