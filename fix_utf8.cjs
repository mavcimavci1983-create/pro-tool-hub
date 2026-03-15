const fs = require("fs");
const path = "C:/Users/Mehmet AVCI/Desktop/ProTollHub/server/routes.ts";
let content = fs.readFileSync(path, "utf8");

const fixes = [
  // ş
  ["Ã…ş¸", "ş"], ["Å\u009e", "Ş"],
  // ı  
  ["Ä±", "ı"], ["Ã„Â±", "ı"],
  // ğ
  ["ÄŸ", "ğ"], ["Ã„ş¸", "ğ"],
  // ü
  ["Ã¼", "ü"], ["ÃƒÂ¼", "ü"],
  // ö
  ["Ã¶", "ö"],
  // ç
  ["Ã§", "ç"],
  // İ
  ["Ä°", "İ"],
  // em dash —
  ["Ã¢â‚¬\"", "—"], ["Ã¢â‚¬\u0093", "—"],
  // → 
  ["Ã¢\"\u0099", "→"],
  // box drawing chars - sadece temizle
  [/Ã¢\u201c[^\s"'`]+/g, "─"],
  [/Ã¢\u201d[^\s"'`]+/g, "╔"],
];

for (const [from, to] of fixes) {
  if (from instanceof RegExp) {
    content = content.replace(from, to);
  } else {
    while (content.includes(from)) {
      content = content.replace(from, to);
    }
  }
}

fs.writeFileSync(path, content, "utf8");
const remaining = (content.match(/Ã[^\s]/g) || []).length;
console.log("Kalan bozuk:", remaining);
