export default (...args) => {
  return args.reduce((prev, current) => {
    return prev + current;
  }, 0);
};
