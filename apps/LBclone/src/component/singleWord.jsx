import { cn } from "../cn";

const SingleWordHighlight = ({ word, index, total, textFormat, highlightFormat }) => {
  const isFirstWord = index === 0;
  const isLastWord = index === total - 1;

  // No special formatting for the first and last letters if it's the only word
  // This handles the case where there is only a single word
  const shouldHighlightFirst = !isFirstWord;
  const shouldHighlightLast = !isLastWord;

  const firstLetterClass = cn(textFormat, {
    [highlightFormat]: shouldHighlightFirst,
  });

  const lastLetterClass = cn(textFormat, {
    [highlightFormat]: shouldHighlightLast,
  });

  return (
    <div className="flex flex-row items-center" key={index}>
      <p key={index} className={textFormat}>
        <span className={firstLetterClass}>{word.charAt(0)}</span>
        {word.slice(1, word.length - 1)}
        <span className={lastLetterClass}>{word.charAt(word.length - 1)}</span>
      </p>
    </div>
  );
};

export default SingleWordHighlight;