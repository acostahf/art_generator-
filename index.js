const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");

// function to save the image
const saveLayer = (_canvas) => {
  // this file takes in two things: the output path and buffer array
  fs.writeFileSync("./newImage.png", _canvas.toBuffer("image/png"));
  console.log("img created");
};

const drawLayer = async () => {
  const image = await loadImage("./ADA.png");
  //ctx.drawImage(img, x, y , width, height)
  ctx.drawImage(image, 0, 0, 1000, 1000);
  console.log("this ran");
  //global canvas
  saveLayer(canvas);
};

drawLayer();
