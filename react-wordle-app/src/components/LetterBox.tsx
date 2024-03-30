import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";

interface LetterBoxProps {
  index: number;
  letter: string | null;
  isCorrect: boolean;
  isFound: boolean;
  canCheck: boolean;
}

const LetterBox = (props: LetterBoxProps) => {
  const controls = useAnimation();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    if (props.canCheck) {
      controls.start({
        rotateY: 360,
        transition: { delay: 0.25 * props.index, duration: 0.5 },
      }); // Change the animation properties as per your requirement

      const timeoutId = setTimeout(() => {
        setCanShow(true);
      }, 300 * props.index); // 0.3 second delay
      return () => clearTimeout(timeoutId); // Clear timeout on unmount or when props change
    } else {
      controls.start({ scale: 1 });
    }
  }, [props.canCheck]);

  return (
    <motion.div
      animate={controls}
      className={`h-[60px] w-[60px] rounded-sm select-none ${
        props.canCheck && canShow ? "border-none" : "border-2"
      } border-slate-500/30`}
    >
      <p
        className={` ${
          props.isCorrect && props.canCheck && canShow
            ? "bg-green-600 text-white"
            : ""
        } ${
          props.isFound && !props.isCorrect && props.canCheck && canShow
            ? "bg-yellow-500 text-white"
            : ""
        }
        ${
          !props.isCorrect && !props.isFound && props.canCheck && canShow
            ? "bg-zinc-600 text-white"
            : ""
        } rounded-sm duration-150 w-full h-full items-center flex justify-center text-3xl font-bold`}
      >
        {props.letter}
      </p>
    </motion.div>
  );
};

export default LetterBox;
