const globalContainerVariants = {
  hidden: {
    opacity: 0,
    x: '-100px',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: 'easeInOut', duration: 0.75 },
  },
  exit: {
    x: '100px',
    opacity: 0,
    transition: {
      ease: 'easeInOut',
    },
  },
};

export default globalContainerVariants;
