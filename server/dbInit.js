const gardensService = require("./service/gardens.service");

const { randomElementFromArray, randomIntInRange } = require("./utils");
const { DWC_META } = require("../shared-constants");
const { getConfig } = require("./config.js");

const generateProps = () => {
  const noTiles = 4;
  const stepsPerTile = 5;

  const tileProps = [];
  for (let i = 0; i < noTiles; i++) {
    const currTile = [];
    for (let j = 0; j < stepsPerTile; j++) {
      const shapeTypes = getConfig().backgroundTypes;
      const shape = randomElementFromArray(shapeTypes);
      const target =
        shape == DWC_META.tileShapes.TRIANGLE
          ? randomElementFromArray([0.25, 0.4, 0.5, 0.6, 0.75])
          : randomElementFromArray([0.25, 0.3, 0.4, 0.75]);
      currTile.push({
        target: target,
        duration: randomIntInRange(25000, 75000),
        shape: shape,
        anchor: randomElementFromArray([0, 1, 2, 3]),
      });
    }

    tileProps.push(currTile);
  }

  const shaderProps = {
    shaderTimeSeed: Math.random() * 10,
    shaderSpeed: Math.random() * 10 + 1,
  };

  return {
    tileProps,
    shaderProps,
  };
};

const xFrom = -10;
const yFrom = -10;
const xTo = 10;
const yTo = 10;

const init = async () => {
  const gardens = [];
  for (let x = xFrom; x <= xTo; x++) {
    for (let y = yFrom; y <= yTo; y++) {
      const { tileProps, shaderProps } = generateProps();
      const garden = { x, y, index: Math.abs(x) + Math.abs(y), tileProps, shaderProps };
      gardens.push(garden);
    }
  }

  try {
    await Promise.all(gardens.map((g) => gardensService.save(g)));
  } catch (e) {
    console.error(e);
  }
};

init();
