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
        rotateX: 360,
        transition: { delay: 0.4 * props.index, duration: 0.5 },
      }); // Change the animation properties as per your requirement

      const timeoutId = setTimeout(() => {
        setCanShow(true);
      }, 400 * props.index); // 0.3 second delay
      return () => clearTimeout(timeoutId); // Clear timeout on unmount or when props change
    } else {
      controls.start({ scale: 1 });
    }
  }, [props.canCheck]);

  return (
    <motion.div
      animate={controls}
      className={`md:h-[56px] md:w-[56px] h-12 w-12 rounded-[1px] select-none ${
        props.canCheck && canShow ? "border-none" : "border-2"
      } border-zinc-500/40`}
    >
      <p
        className={` ${
          props.isCorrect && props.canCheck && canShow
            ? "bg-green-700/80 text-white"
            : ""
        } ${
          props.isFound && !props.isCorrect && props.canCheck && canShow
            ? "bg-yellow-600/80 text-white"
            : ""
        }
        ${
          !props.isCorrect && !props.isFound && props.canCheck && canShow
            ? "bg-zinc-600/80 dark:bg-[#282828] text-white"
            : ""
        } rounded-[1px] duration-150 w-full h-full items-center flex justify-center md:text-3xl text-2xl font-bold`}
      >
        {props.letter}
      </p>
    </motion.div>
  );
};

export default LetterBox;
