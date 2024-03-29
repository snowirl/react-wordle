import LetterBox from "./LetterBox";
import { useEffect } from "react";
import { useState } from "react";

interface WordRowProps {
  index: number;
  row: number;
  correctWord: string;
  selectedLetters: string[];
}

const WordRow = (props: WordRowProps) => {
  const [canCheck, setCanCheck] = useState(false);
  useEffect(() => {
    if (props.row > props.index) {
      if (props.row - props.index === 1) {
        setCanCheck(true);
      }
    }
  }, [props.row]);

  return (
    <div className=" space-x-1.5 flex">
      <LetterBox
        index={0}
        isFound={
          props.correctWord.includes(props.selectedLetters[0]) ? true : false
        }
        isCorrect={
          props.correctWord[0] === props.selectedLetters[0] ? true : false
        }
        canCheck={canCheck}
        letter={props.selectedLetters[0]}
      />
      <LetterBox
        index={1}
        isFound={
          props.correctWord.includes(props.selectedLetters[1]) ? true : false
        }
        isCorrect={
          props.correctWord[1] === props.selectedLetters[1] ? true : false
        }
        canCheck={canCheck}
        letter={props.selectedLetters[1]}
      />
      <LetterBox
        index={2}
        isFound={
          props.correctWord.includes(props.selectedLetters[2]) ? true : false
        }
        isCorrect={
          props.correctWord[2] === props.selectedLetters[2] ? true : false
        }
        canCheck={canCheck}
        letter={props.selectedLetters[2]}
      />
      <LetterBox
        index={3}
        isFound={
          props.correctWord.includes(props.selectedLetters[3]) ? true : false
        }
        isCorrect={
          props.correctWord[3] === props.selectedLetters[3] ? true : false
        }
        canCheck={canCheck}
        letter={props.selectedLetters[3]}
      />
      <LetterBox
        index={4}
        isFound={
          props.correctWord.includes(props.selectedLetters[4]) ? true : false
        }
        isCorrect={
          props.correctWord[4] === props.selectedLetters[4] ? true : false
        }
        canCheck={canCheck}
        letter={props.selectedLetters[4]}
      />
    </div>
  );
};

export default WordRow;
