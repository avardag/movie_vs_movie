// const onInput = (event) => {
//   fetchData(url, event.target.value);
// };

/*
//onInput is activated every second after user stopped typing input
let timeoutId;
const onInput = (event) => {
  // func is run every time input val changes

  if (timeoutId) {
    //if there is a setTimeout, clear that one(and assing new one (below))
    clearTimeout(timeoutId);
  }
  //assinging timeout for a sec. And searching only when user stopped typing
  timeoutId = setTimeout(() => {
    fetchData(url, event.target.value);
  }, 1000);
};
*/

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
