class Field {
  constructor() {
    this.data = new Map();
  }

  render = () => {
    const result = [];
    for (const [y, x] of this.data.keys()) {
      result.push(y, x);
    }
    return _.join(result);
  };

  setCell = ([y, x], value) => {
    this.data.set([y, x], value);
  };
}

const main = async () => {
  const fieldElement = document.getElementById("field");

  const field = new Field();
  field.setCell([1, 1], "*");

  document.addEventListener("keypress", (e) => {
    fieldElement.textContent = e.code;
  });

  for (;;) {
    await Promise.delay(500);
    fieldElement.textContent = new Date() + "\n" + field.render();
    field.textContent += new Date();
  }
};

main();
