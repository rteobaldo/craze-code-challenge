window.requestInterval = (cb, delay) => {
  let requestAnimation = window.requestAnimationFrame;
  let start = Date.now();
  let stop = false;
  let intervalFunc = () => {
    Date.now() - start < delay || (start = start + delay, cb());
    stop || requestAnimation(intervalFunc);
  };

  requestAnimation(intervalFunc);
  return {
    clear: () => stop = true
  };
}
