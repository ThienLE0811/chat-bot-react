import { Transition, Variants } from "framer-motion";

const variants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const transition: Transition = { duration: 0.3 };

export { variants, transition };