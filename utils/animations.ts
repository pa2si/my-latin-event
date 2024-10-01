import { Variants } from 'framer-motion';

export const staggeredAnimationFromLeft = (
  delayMultiplier: number
): Variants => ({
  initial: {
    opacity: 0,
    x: -100,
  },
  animate: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: delayMultiplier * custom,
    },
  }),
});
