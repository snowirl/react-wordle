interface KeyboardProps {
  handleLetterClick: (letter: string) => void;
  handleBack: () => void;
  handleEnter: () => void;
  correctWord: string;
  row: number;
  correctLetters: string[];
  foundLetters: string[];
  wrongLetters: string[];
}

const Keyboard = (props: KeyboardProps) => {
  const qwertyLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const handleClick = (letter: string) => {
    props.handleLetterClick(letter);
  };

  return (
    <div className="relative">
      {qwertyLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-wrap items-center justify-center"
        >
          {row.map((letter) => (
            <button
              className={` text-xl  mx-1 my-1 rounded-md font-bold md:w-11 md:h-14 w-9 h-12  ${
                props.correctLetters.includes(letter)
                  ? "bg-green-700/80 text-white"
                  : props.foundLetters.includes(letter)
                  ? "bg-yellow-600/80 text-white"
                  : props.wrongLetters.includes(letter)
                  ? "bg-zinc-600/80 dark:dark:bg-[#282828] text-white"
                  : "bg-gray-300 dark:bg-zinc-500"
              } `}
              key={letter}
              onClick={() => handleClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
      <div className="absolute bottom-0 md:-left-2">
        <button
          onClick={props.handleEnter}
          className="text-sm bg-gray-300 dark:bg-zinc-500 mx-1 my-1 rounded-md font-bold md:w-20 md:h-14 w-[60px] h-12"
        >
          ENTER
        </button>
      </div>
      <div className="absolute bottom-0 md:-right-2 right-0">
        <button
          onClick={props.handleBack}
          className="flex items-center justify-center text-sm dark:bg-zinc-500 bg-gray-300 mx-1 my-1 rounded-md font-bold md:w-20 md:h-14 w-[60px] h-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
