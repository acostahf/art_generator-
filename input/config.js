const fs = require("fs");
const width = 1000;
const height = 1000;
// gets the path
const dir = __dirname;

const rarity = [
  { key: "", val: "original" },
  { key: "_sr", val: "super rare" },
];
// takes the str and loops through to take the val and assign the rarity
const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });
  return itemRarity;
};

// everything with spaces , no png, no sr
const cleanName = (_str) => {
  // slice last 4 char
  let name = _str.slice(0, -4);
  //   check for rarity
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = (path) => {
  return (
    fs
      //   gets out array of the file names
      .readdirSync(path)
      // dot files removes them
      .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      // map through each item
      .map((i, index) => {
        //object
        return {
          id: index + 1,
          name: cleanName(i),
          fileName: i,
          rarity: addRarity(i),
        };
      })
  );
};

const layers = [
  {
    id: 4,
    name: "background",
    location: `${dir}/background/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 0,
    name: "shape",
    location: `${dir}/shape/`,
    elements: getElements(`${dir}/shape/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 2,
    name: "mouth",
    location: `${dir}/mouth/`,
    elements: getElements(`${dir}/mouth/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 3,
    name: "eyes",
    location: `${dir}/eyes/`,
    elements: getElements(`${dir}/eyes/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
];

module.exports = { layers, width, height };
