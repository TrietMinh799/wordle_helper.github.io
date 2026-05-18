const Word = ({ content }) => {
  return (
    <div
      className="words"
      onClick={() => {
        const newWindow = window.open(
          `https://dictionary.cambridge.org/dictionary/english/${content}`,
          "_blank",
          "noopener,noreferrer",
        );

        if (newWindow) newWindow.opener = null;
      }}
    >
      <p>{content}</p>
    </div>
  );
};

export default Word;
