import * as cowsay from "cowsay"
import * as fs from "fs"
import * as readline from "readline";

const cowFiles = fs.readdirSync("/Users/kaspir/projects/hello-js/node_modules/cowsay/cows/")
const cows = cowFiles.map(s => s.substr(0, s.length - 4))
console.info(cows. join(", "))

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let counter = 0
rl.on('line', (input) => {
  const cow = cows[counter]
  const message = cowsay.say({text: `I'm ${cow} ${counter}`, f:cow})
  console.log(message)
  counter += 1
  });
