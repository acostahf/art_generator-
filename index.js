const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
const { layers, width, height } = require("./input/config.js");
// number of artworks that are going to be created
const edition = 1;

// function to save the image
const saveLayer = (_canvas, _edition) => {
  // this file takes in two things: the output path and buffer array
  fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer("image/png"));
  console.log("img created");
};

const drawLayer = async (_layer, _edition) => {
  let element =
    //   selecting a random element for the elements array
    _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
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
  console.log(
    `I created the ${_layer.name} layer, and choose element ${element.name}`
  );
  //global canvas
  saveLayer(canvas, _edition);
};

// loops the edtions
for (let i = 1; i <= edition; i++) {
  // for each edition draw a image
  layers.forEach((layer) => {
    drawLayer(layer, i);
  });
  console.log("creating edition" + i);
}
