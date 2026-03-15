const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "server", "routes.ts");
let c = fs.readFileSync(file, "utf8");

// 1) loadJimp fonksiyonunu bul ve değiştir
const startMarker = "  let _jimp: any = null;";
const endMarker = "    throw new Error(\"Image processing library not available. Run: npm install jimp\");\n  }";
const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker) + endMarker.length;
if (startIdx === -1 || endIdx === -1) { console.error("MARKER NOT FOUND"); process.exit(1); }

const newLoadJimp = `  let _jimp: any = null;
  async function loadJimp() {
    if (_jimp) return _jimp;
    try {
      const j = _require("jimp");
      _jimp = { Jimp: j.Jimp, MIME_JPEG: "image/jpeg", MIME_PNG: "image/png" };
      return _jimp;
    } catch(e) {}
    throw new Error("jimp not available: " + String(e));
  }

  async function jimpProcess(J, buffer, fn, mime) {
    const img = await J.Jimp.fromBuffer(buffer);
    fn(img);
    return img.getBuffer(mime);
  }`;

c = c.slice(0, startIdx) + newLoadJimp + c.slice(endIdx);

// 2) compress-image: J.read -> jimpProcess
c = c.replace(
  `        const img = await J.read(req.file.buffer);\n        outputBuffer = await img.quality(quality).getBufferAsync(J.MIME_JPEG);`,
  `        outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.quality(quality); }, J.MIME_JPEG);\n        mimeType = "image/jpeg";`
);

// 3) resize-image: J.read -> jimpProcess
c = c.replace(
  `        const img = await J.read(req.file.buffer);\n        img.scaleToFit(width || img.bitmap.width, height || img.bitmap.height);\n        outputBuffer = await img.quality(quality).getBufferAsync(J.MIME_JPEG);`,
  `        outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.scaleToFit({ w: width || img.bitmap.width, h: height || img.bitmap.height }); img.quality(quality); }, J.MIME_JPEG);\n        mimeType = "image/jpeg";`
);

// 4) image-action else block - find and replace
const actionStart = `        const img = await J.read(req.file.buffer);\n        if (actionType === "compress")`;
const actionEnd = `        } else return res.status(400).json({ error: \`Unknown actionType: \${actionType}\` });\n      }`;
const aStart = c.indexOf(actionStart);
const aEnd = c.indexOf(actionEnd, aStart) + actionEnd.length;
if (aStart === -1) { console.error("ACTION BLOCK NOT FOUND"); process.exit(1); }

const newActionBlock = `        if (actionType === "compress") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.quality(quality); }, J.MIME_JPEG);
        } else if (actionType === "rotate") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.rotate(parseInt(req.body && req.body.angle || "90", 10)); img.quality(quality); }, J.MIME_JPEG);
        } else if (actionType === "flip") {
          const isV = req.body && req.body.direction === "vertical";
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.flip({ horizontal: !isV, vertical: isV }); }, J.MIME_JPEG);
        } else if (actionType === "grayscale") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.greyscale(); }, J.MIME_JPEG);
        } else if (actionType === "resize") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => {
            img.scaleToFit({ w: req.body && req.body.width ? parseInt(req.body.width,10) : img.bitmap.width, h: req.body && req.body.height ? parseInt(req.body.height,10) : img.bitmap.height });
            img.quality(quality);
          }, J.MIME_JPEG);
        } else if (actionType === "convert") {
          const fmt = ((req.body && req.body.format) || "jpeg").replace("jpg","jpeg");
          if (fmt === "png") { outputBuffer = await jimpProcess(J, req.file.buffer, () => {}, J.MIME_PNG); mimeType = "image/png"; }
          else { outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.quality(quality); }, J.MIME_JPEG); }
        } else { return res.status(400).json({ error: "Unknown actionType: " + actionType }); }
      }`;

c = c.slice(0, aStart) + newActionBlock + c.slice(aEnd);

fs.writeFileSync(file, c, "utf8");
console.log("DONE - lines: " + c.split("\n").length);
