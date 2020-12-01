const fs = require('fs');
var start = new Date();
fs.readFile(__dirname + '/input.txt', (_, data) => {
  const numbers = data.toString().split('\n');
  const goal = 2020;
  const findNumber = (next) =>
    numbers.find((number) => !!number && +number + next === goal);
  let found = 0,
    next = 0;
  while (!found || !numbers.length) {
    next = +numbers.pop();
    found = findNumber(next);
  }
  console.log(next * found);
  var end = new Date() - start;
  console.info('Execution time: %dms', end);
});
