const globalContainerVariants = {
  hidden: {
    opacity: 0,
    scale: '110%',
  },
  visible: {
    opacity: 1,
    scale: '100%',
    transition: { ease: 'easeInOut', duration: 0.3 },
  },
  exit: {
    scale: '90%',
    opacity: 0,
    transition: {
      ease: 'easeInOut',
      duration: 0.3,
    },
  },
};

export default globalContainerVariants;
