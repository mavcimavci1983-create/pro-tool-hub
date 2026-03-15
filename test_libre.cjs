const lc = require("./node_modules/libreoffice-convert");
const fs = require("fs");

const buf = fs.readFileSync("C:/Users/Mehmet AVCI/Desktop/index.docx");
console.log("Input size:", buf.length);

const convertAsync = (buf, fmt, filter, opts) => new Promise((resolve, reject) => {
  lc.convertWithOptions(buf, fmt, filter, opts, (err, result) => {
    if (err) reject(err); else resolve(result);
  });
});

convertAsync(buf, ".pdf", undefined, { 
  sofficeBinaryPaths: ["C:\\Program Files\\LibreOffice\\program\\soffice.exe"] 
})
.then(pdf => {
  fs.writeFileSync("C:/Users/Mehmet AVCI/Desktop/output.pdf", pdf);
  console.log("SUCCESS! PDF size:", pdf.length);
})
.catch(err => {
  console.error("ERROR:", err.message);
});
