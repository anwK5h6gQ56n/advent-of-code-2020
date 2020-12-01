const fs = require('fs');
fs.readFile(__dirname + '/input.txt', (_, data) => {
  const numbers = data.toString().split('\n');
  const goal = 2020;
  let found = 0,
    found2 = 0,
    next = 0;
  while (!found && numbers.length) {
    next = +numbers.pop();
    if (!next) continue;
    found = numbers.find((number) => {
      const newGoal = goal - next;
      if (!number || +number > newGoal) return false;
      found2 = numbers.find((number2) => +number + +number2 === newGoal);
      return !!found2;
    });
  }
  console.log(next * found * found2);
});
