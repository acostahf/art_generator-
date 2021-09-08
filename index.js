const fs = require("fs");
const myArgs = process.argv.slice(2);
const { createCanvas, loadImage } = require("canvas");
const { layers, width, height } = require("./input/config.js");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
// number of artworks that are going to be created
const editionSize = myArgs.length > 0 ? Number(myArgs[0]) : 1;
var metadata = [];
var attributes = [];
var hash = [];
var decodedHash = [];
var dnaList = [];

// function to save the image
const saveLayer = (_canvas, _edition) => {
  // this file takes in two things: the output path and buffer array
  fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer("image/png"));
  //   console.log("img created");
};

const addMetadata = (_edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  //   clear after push
  attributes = [];
  hash = [];
  decodedHash = [];
};

const addAttributes = (_element, _layer) => {
  let tempAttr = {
    id: _element.id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

const drawLayer = async (_layer, _edition) => {
  let element =
    //   selecting a random element for the elements array
    _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
  addAttributes(element, _layer);
  // load each one the files
  const image = await loadImage(`${_layer.location}${element.fileName}`);
  //ctx.drawImage(img, x, y , width, height) draws image on canvas
  ctx.drawImage(
    image,
    _layer.position.x,
    _layer.position.y,
    _layer.size.width,
    _layer.size.height
  );
  //   console.log(
  //     `I created the ${_layer.name} layer, and choose element ${element.name}`
  //   );
  //global canvas
  saveLayer(canvas, _edition);
};

const isDnaUnique = (_DnaList = [], _dna) => {
  // true or false will be return, if its not unique it is false
  let foundDna = _DnaList.find((i) => i === _dna);
  return foundDna == undefined ? true : false;
};

const createDna = (_len) => {
  let randNum = Math.floor(
    Number(`1e${_len}`) + Math.random() * Number(`9e${_len}`)
  );
  return randNum;
};

const writeMetaData = () => {
  fs.writeFileSync("./output/_metadata.json", JSON.stringify(metadata));
};

// this is where the miniting takes place
const startCreating = () => {
  let editionCount = 1;
  // loops the edtions
  while (editionCount <= editionSize) {
    let newDna = createDna(layers.length * 2 - 1);
    console.log(`${newDna}`);
    if ((isDnaUnique(dnaList), newDna)) {
      // for each edition draw a image
      layers.forEach((layer) => {
        drawLayer(layer, i);
      });
      // addMetadata(i);
      // console.log("creating edition " + i);
      dnaList.push(newDna);
      editionCount++;
    } else {
      console.log("DNA exists");
    }
  }
};

startCreating();
writeMetaData();
