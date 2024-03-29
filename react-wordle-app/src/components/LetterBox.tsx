import { motion } from "framer-motion";

interface LetterBoxProps {
  index: number;
  letter: string | null;
  isCorrect: boolean;
  isFound: boolean;
  canCheck: boolean;
}

const LetterBox = (props: LetterBoxProps) => {
  return (
    <motion.div
      className={`h-[60px] w-[60px] rounded-sm select-none ${
        props.canCheck ? "border-none" : "border-2"
      } border-slate-500/30`}
    >
      <p
        className={` ${
          props.isCorrect && props.canCheck ? "bg-green-600 text-white" : ""
        } ${
          props.isFound && !props.isCorrect && props.canCheck
            ? "bg-yellow-500 text-white"
            : ""
        }
        ${
          !props.isCorrect && !props.isFound && props.canCheck
            ? "bg-zinc-600 text-white"
            : ""
        } rounded-sm duration-500 w-full h-full items-center flex justify-center text-3xl font-bold`}
      >
        {props.letter}
      </p>
    </motion.div>
  );
};

export default LetterBox;
