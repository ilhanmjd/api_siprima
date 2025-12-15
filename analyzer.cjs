/** "npm run analyze"
 * analyzer.js
 * Advanced Frontend Abuse Analyzer (AST-based)
 *
 * Output:
 *  - ./abuse-report.json
 *  - ./abuse-report.html
 *
 * Usage:
 *  - node analyzer.js
 *
 * Notes:
 *  - Run from project root (where `src/` exists)
 *  - Node 14+ recommended
 */

const fs = require("fs-extra");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const chalk = require("chalk");
const path = require("path");
const he = require("he");

const SRC_GLOB = "src/**/*.{js,jsx,ts,tsx}";
const OUTPUT_JSON = "abuse-report.json";
const OUTPUT_HTML = "abuse-report.html";

const readFile = (p) => fs.readFileSync(p, "utf8");

const severityFor = (kind) => {
  switch (kind) {
    case "infinite_effect": return 9;
    case "dependency_fn": return 8;
    case "no_abort": return 7;
    case "duplicate_fetch": return 7;
    case "strictmode": return 4;
    case "console_large": return 5;
    case "api_call": return 3;
    default: return 1;
  }
};

const makeFinding = ({ file, message, kind, loc }) => ({
  file: path.relative(process.cwd(), file),
  message,
  kind,
  severity: severityFor(kind),
  loc: loc || null,
  hint: hints[kind] || ""
});

const hints = {
  infinite_effect: "Pastikan useEffect memiliki dependency array atau guard (isMounted/flag) dan hindari mengubah context di dalam effect yang menjadi dependency.",
  dependency_fn: "Memoize fungsi dengan useCallback atau keluarkan fungsi dari dependency array. Jangan masukkan fungsi yang berubah-ubah ke dependencies.",
  no_abort: "Gunakan AbortController atau signal untuk membatalkan request ketika komponen unmounts.",
  duplicate_fetch: "Gunakan central cache (Context / React Query / SWR) atau pagination. Hindari memanggil endpoint yang sama di banyak komponen.",
  strictmode: "React.StrictMode ada di dev (double-run useEffect) tidak di production. Di dev gunakan guard jika efek sensitif terhadap double-run.",
  console_large: "Hapus console.log besar di production; gunakan debug flags.",
  api_call: "Periksa apakah panggilan API besar harus dipaginate/di-cache."
};

const report = {
  generatedAt: new Date().toISOString(),
  filesScanned: 0,
  findings: [],
  summary: {}
};

console.log(chalk.blueBright("\n== Starting Advanced Frontend Abuse Analyzer ==\n"));
console.log("Scanning files:", SRC_GLOB);

const files = glob.sync(SRC_GLOB, { nodir: true });

report.filesScanned = files.length;

const apiCallsIndex = {}; // endpoint -> [{file, loc}]
const fileFetchCounts = {}; // file -> count of getAssets / api.get
const filesWithStrictMode = new Set();
const isFunctionishDep = (dep) => {
  if (!dep) return false;
  if (dep.type === "Identifier") {
    const name = dep.name || "";
    return /^(handle|on|update|dispatch|fetch|get|load)/i.test(name);
  }
  return dep.type === "MemberExpression";
};

files.forEach((file) => {
  let code;
  try {
    code = readFile(file);
  } catch (e) {
    console.warn(chalk.yellow(`Could not read ${file}: ${e.message}`));
    return;
  }

  // try to parse; tolerate modern syntax
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript",
        "classProperties",
        "optionalChaining",
        "nullishCoalescingOperator",
        "decorators-legacy",
        "dynamicImport"
      ]
    });
  } catch (err) {
    report.findings.push(makeFinding({
      file,
      message: `Gagal parse file: ${err.message}`,
      kind: "parse_error"
    }));
    return;
  }

  let localFetchCount = 0;
  let hasAbort = false;
  let hasConsole = false;
  let detectedStrictMode = code.includes("<React.StrictMode>") || code.includes("React.StrictMode");

  if (detectedStrictMode) {
    filesWithStrictMode.add(file);
    report.findings.push(makeFinding({
      file,
      message: "React.StrictMode terdeteksi (development double-invoke untuk useEffect).",
      kind: "strictmode"
    }));
  }

  // traverse AST
  traverse(ast, {
    enter(pathNode) {
      const node = pathNode.node;

      // Detect api.get or api.getAssets or axios usage
      if (node.type === "CallExpression" && node.callee) {
        // detect MemberExpression like api.getAssets(...) or api.get(...)
        if (node.callee.type === "MemberExpression") {
          const objectName = node.callee.object.name || (node.callee.object?.object?.name);
          const prop = node.callee.property?.name || (node.callee.property?.value);
          // Common patterns: api.getAssets, api.get, axios.get
          if (objectName === "api" || objectName === "axios") {
            // get endpoint string if present
            let endpoint = null;
            if (node.arguments && node.arguments.length > 0) {
              const first = node.arguments[0];
              if (first.type === "StringLiteral") endpoint = first.value;
              if (first.type === "ObjectExpression") {
                // sometimes axios.get(url, { params: ... })
                // skip
              }
            }
            // generic mark
            localFetchCount++;
            fileFetchCounts[file] = (fileFetchCounts[file] || 0) + 1;
            report.findings.push(makeFinding({
              file,
              message: `Ditemukan panggilan API: ${objectName}.${prop}()`,
              kind: "api_call",
              loc: node.loc
            }));
            if (endpoint) {
              apiCallsIndex[endpoint] = apiCallsIndex[endpoint] || [];
              apiCallsIndex[endpoint].push({ file, loc: node.loc });
            }
          }
        }

        // detect raw fetch(...) calls
        if (node.callee.type === "Identifier" && node.callee.name === "fetch") {
          localFetchCount++;
          fileFetchCounts[file] = (fileFetchCounts[file] || 0) + 1;
          report.findings.push(makeFinding({
            file,
            message: `Ditemukan panggilan fetch() (raw fetch).`,
            kind: "api_call",
            loc: node.loc
          }));
        }
      }

      // detect console.log
      if (node.type === "CallExpression" && node.callee &&
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "console") {
        hasConsole = true;
        report.findings.push(makeFinding({
          file,
          message: `console.${node.callee.property.name}() ditemukan — pastikan tidak log objek besar di production.`,
          kind: "console_large",
          loc: node.loc
        }));
      }

      // detect AbortController usage / controller.abort
      if (node.type === "NewExpression" && node.callee.type === "Identifier" && node.callee.name === "AbortController") {
        hasAbort = true;
      }
      if (node.type === "CallExpression" && node.callee &&
          node.callee.type === "MemberExpression" &&
          node.callee.property.name === "abort") {
        hasAbort = true;
      }

      // detect useEffect
      if (node.type === "CallExpression" &&
          node.callee.type === "Identifier" &&
          node.callee.name === "useEffect") {

        const args = node.arguments || [];
        // if first arg is a function
        const effectFn = args[0];
        const depArray = args[1];

        // if no depArray or dependency is not array -> risk
        if (!depArray) {
          report.findings.push(makeFinding({
            file,
            message: "useEffect dipanggil tanpa dependency array (atau dependency tidak diberikan) — akan berjalan tiap render.",
            kind: "infinite_effect",
            loc: node.loc
          }));
        } else if (depArray.type !== "ArrayExpression") {
          report.findings.push(makeFinding({
            file,
            message: "useEffect memiliki dependency non-array (tidak standar) — periksa kembali.",
            kind: "infinite_effect",
            loc: node.loc
          }));
        } else {
          // analyze elements in dependency array
          const deps = depArray.elements || [];
          deps.forEach((d) => {
            if (!d) return;
            if (isFunctionishDep(d)) {
              const name = d.name || d.property?.name || "callback";
              report.findings.push(makeFinding({
                file,
                message: `useEffect memiliki dependency fungsi atau handler '${name}' — pastikan termemoisasi agar tidak looping.`,
                kind: "dependency_fn",
                loc: node.loc
              }));
              return;
            }
            if (d.type === "CallExpression") {
              report.findings.push(makeFinding({
                file,
                message: "useEffect memiliki dependency non-primitif (CallExpression) → dapat menyebabkan rerun tak terduga.",
                kind: "dependency_fn",
                loc: node.loc
              }));
            }
          });

          // heuristic: if effect body contains call to setState or context update and dependency includes functions, mark infinite risk
          if (effectFn && (effectFn.type === "ArrowFunctionExpression" || effectFn.type === "FunctionExpression")) {
            let bodyStr = "";
            try { bodyStr = code.slice(effectFn.start, effectFn.end); } catch (e) {}
            const updatesState = /updateAssetData|set[A-Z0-9_]+|dispatch|setState|setAssets|setRisks/.test(bodyStr);
            const riskyDeps = deps.some(isFunctionishDep);
            if (updatesState && riskyDeps) {
              report.findings.push(makeFinding({
                file,
                message: "Effect memanggil updater (setSomething/updateAssetData) dengan dependency fungsi/objek yang bisa berubah → risiko loop/refetch.",
                kind: "infinite_effect",
                loc: node.loc
              }));
            }
          }
        }
      } // end useEffect

    } // end enter
  });

  // final per-file checks
  if (!hasAbort && localFetchCount > 0) {
    report.findings.push(makeFinding({
      file,
      message: "File memanggil API tetapi tidak menemukan penggunaan AbortController (controller/abort).",
      kind: "no_abort"
    }));
  }
  if (hasConsole) {
    // already pushed console finding in traversal; this ensures it's noted
  }
});

// post-processing: detect duplicate endpoint usage (heuristic by endpoint strings) and many files calling api.getAssets
const manyFilesCallingGetAssets = Object.entries(fileFetchCounts).filter(([f,c]) => c > 1);
if (Object.keys(fileFetchCounts).length === 0) {
  // no api usage found? still ok
}

const endpoints = Object.keys(apiCallsIndex);
endpoints.forEach(ep => {
  const callers = apiCallsIndex[ep];
  if (callers && callers.length > 1) {
    report.findings.push(makeFinding({
      file: callers[0].file,
      message: `Endpoint literal "${ep}" dipanggil di ${callers.length} file (duplicate literal endpoint).`,
      kind: "duplicate_fetch"
    }));
  }
});

// special check: many different files call api.getAssets (common pattern)
const getAssetsFiles = files.filter(f => {
  const txt = readFile(f);
  return /getAssets\(|getAssets\W/.test(txt);
});
if (getAssetsFiles.length > 1) {
  report.findings.push(makeFinding({
    file: getAssetsFiles[0],
    message: `Terdapat ${getAssetsFiles.length} file yang memanggil getAssets() secara langsung. Pertimbangkan central cache (AssetContext / ReactQuery).`,
    kind: "duplicate_fetch"
  }));
}

// Summarize
const severityCounts = report.findings.reduce((acc, x) => {
  acc[x.kind] = (acc[x.kind] || 0) + 1;
  return acc;
}, {});

report.summary = {
  totalFindings: report.findings.length,
  byKind: severityCounts,
  filesWithStrictMode: Array.from(filesWithStrictMode).map(f => path.relative(process.cwd(), f)),
  scannedFiles: files.length
};

// write JSON report
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2), "utf8");
console.log(chalk.green(`\n✅ Report saved: ${OUTPUT_JSON}`));

// generate simple HTML report
const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Abuse Analyzer Report</title>
<style>
  body{font-family: Inter, Arial, sans-serif; padding:20px; background:#fafafa; color:#222}
  h1{color:#111}
  .finding{border-left:4px solid #ff6b6b; background:#fff; padding:12px; margin:10px 0; box-shadow:0 1px 4px rgba(0,0,0,0.04)}
  .meta{font-size:12px; color:#666}
  .hint{background:#f3f7ff;padding:8px;margin-top:8px;border-left:3px solid #2b8cff}
  .low{border-left-color:#7dd3fc}
  .med{border-left-color:#f59e0b}
  .high{border-left-color:#ef4444}
</style>
</head>
<body>
<h1>Frontend Abuse Analyzer Report</h1>
<p>Generated at ${report.generatedAt}</p>
<p>Files scanned: ${report.filesScanned} — Findings: ${report.findings.length}</p>
${report.findings.map(f => `
  <div class="finding ${f.severity >= 8 ? 'high' : f.severity >=5 ? 'med' : 'low'}">
    <div><strong>${he.encode(f.message)}</strong></div>
    <div class="meta">File: ${he.encode(f.file)} ${f.loc ? `| Line: ${f.loc.start.line}` : ''} | Kind: ${f.kind} | Severity: ${f.severity}</div>
    <div class="hint">${he.encode(f.hint || '')}</div>
  </div>
`).join("\n")}
<hr/>
<h3>Summary</h3>
<pre>${he.encode(JSON.stringify(report.summary, null, 2))}</pre>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, html, "utf8");
console.log(chalk.green(`✅ HTML report saved: ${OUTPUT_HTML}`));

console.log(chalk.yellow("\nTips: buka abuse-report.html untuk melihat hasil terformat.\n"));
