const fs = require("fs");
const myArgs = process.argv.slice(2);
const { createCanvas, loadImage } = require("canvas");
const { layers, width, height } = require("./input/config.js");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
// number of artworks that are going to be created
const editionSize = myArgs.length > 0 ? Number(myArgs[0]) : 1;
var metadataList = [];
var attributesList = [];
var dnaList = [];

// function to save the image
const saveImage = (_editionCount) => {
  // this file takes in two things: the output path and buffer array
  fs.writeFileSync(
    `./output/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
  //   console.log("img created");
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: _dna,
    edition: _edition,
    date: dateTime,
    attributesList: attributesList,
  };
  metadataList.push(tempMetadata);

  //   clear after push
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    name: selectedElement.name,
    rarity: selectedElement.rarity,
  });
};

// loads the file
const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(
      `${_layer.location}${_layer.selectedElement.fileName}`
    );
    resolve({ layer: _layer, loadedImage: image });
  });
};

// draws the element
const drawElement = (_element) => {
  //ctx.drawImage(img, x, y , width, height) draws image on canvas
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );
  addAttributes(_element);
};

// split up the dna into pairs of 2, then each one is responsible for selecting a layer
const constructLayerToDna = (_dna, _layers) => {
  let DnaSegment = _dna.toString().match(/.{1,2}/g);
  let mappedDnaToLayers = _layers.map((layer) => {
    let selectedElement =
      layer.elements[parseInt(DnaSegment) % layer.elements.length];
    // console.log(_layer);
    return {
      location: layer.location,
      position: layer.position,
      size: layer.size,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
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

const writeMetaData = (_data) => {
  fs.writeFileSync("./output/_metadata.json", _data);
};

// this is where the miniting takes place
const startCreating = async () => {
  // clear metadata
  writeMetaData("");
  let editionCount = 1;
  // loops the edtions
  while (editionCount <= editionSize) {
    let newDna = createDna(layers.length * 2 - 1);

    if ((isDnaUnique(dnaList), newDna)) {
      // for each edition draw a image
      let results = constructLayerToDna(newDna, layers);
      let loadedElements = []; //promise array

      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });
      //after everything has resloved we are going to take the element and draw it
      await Promise.all(loadedElements).then((elementArray) => {
        elementArray.forEach((element) => {
          drawElement(element);
        });
        saveImage(editionCount);
        addMetadata(newDna, editionCount);
        // console.log(`created edition ${editionCount} with dna: ${newDna}`);
      });
      dnaList.push(newDna);
      editionCount++;
    } else {
      console.log("DNA exists");
    }
  }
  writeMetaData(JSON.stringify(metadataList));
};

startCreating();
