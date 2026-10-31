import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Directories to scan (support both src/app and app)
const candidateDirs = [
  "src/app",
  "app",
  "src/components",
  "components",
  "src/lib",
  "lib",
];

const targetDirs = candidateDirs
  .map((d) => path.join(rootDir, d))
  .filter((d) => fs.existsSync(d));

// Forbidden terms with word boundaries where applicable to prevent false positives in valid words
// (e.g. "elevation" containing "vat", "translate" containing "sla", "useParams" containing "sepa")
const FORBIDDEN_RULES = [
  { name: "$", regex: /\$(?!\{)/g },
  { name: "USD", regex: /\bUSD\b/gi },
  { name: "€", regex: /€/g },
  { name: "EUR", regex: /\bEUR\b/gi },
  { name: "£", regex: /£/g },
  { name: "GBP", regex: /\bGBP\b/gi },
  { name: "SEPA", regex: /\bSEPA\b/gi },
  { name: "VAT", regex: /\bVAT\b/gi },
  { name: "Acme", regex: /\bAcme\b/gi },
  { name: "Europe", regex: /\bEurope\b/gi },
  { name: "Ltd", regex: /\bLtd\b/gi },
  { name: "2023", regex: /\b2023\b/g },
  { name: "2024", regex: /\b2024\b/g },
  { name: "INV-2024", regex: /INV-2024/gi },
  { name: "Frankfurt", regex: /\bFrankfurt\b/gi },
  { name: "2FA", regex: /\b2FA\b/gi },
  { name: "SLA", regex: /\bSLA\b/gi },
  { name: "Odoo Billing", regex: /Odoo\s+Billing/gi },
  { name: "Lorem", regex: /\bLorem\b/gi },
];

function stripComments(code) {
  // Replace multi-line comments with spaces/newlines to preserve line numbers
  const noBlock = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    return match.replace(/[^\n]/g, " ");
  });
  // Replace single-line comments
  return noBlock.replace(/\/\/.*$/gm, "");
}

function scanDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (
      /\.(tsx?|jsx?|mjs|json|css|html)$/i.test(entry.name) &&
      !entry.name.endsWith(".d.ts")
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Collect unique files
const scannedFiles = new Set();
for (const dir of targetDirs) {
  for (const file of scanDirectory(dir)) {
    scannedFiles.add(file);
  }
}

let violationCount = 0;
const violations = [];

for (const filePath of scannedFiles) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const cleanedContent = stripComments(rawContent);

  const lines = cleanedContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of FORBIDDEN_RULES) {
      rule.regex.lastIndex = 0;
      if (rule.regex.test(line)) {
        violationCount++;
        violations.push({
          file: relPath,
          line: i + 1,
          term: rule.name,
          snippet: line.trim().substring(0, 100),
        });
      }
    }
  }
}

if (violationCount > 0) {
  console.error(`\x1b[31m[check:content] FAILED: Found ${violationCount} forbidden term violations:\x1b[0m\n`);
  for (const v of violations) {
    console.error(`  \x1b[33m${v.file}:${v.line}\x1b[0m [\x1b[31m${v.term}\x1b[0m] -> ${v.snippet}`);
  }
  process.exit(1);
} else {
  console.log(`\x1b[32m[check:content] PASSED: All ${scannedFiles.size} files in /app, /components, and /lib are clean of forbidden terms.\x1b[0m`);
  process.exit(0);
}
