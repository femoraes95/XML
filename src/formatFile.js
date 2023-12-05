const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

console.log("Iniciando a formatação dos arquivos...");

const xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true },
  headless: true,
});

async function readAndWriteFiles() {
  const dirPath = "./src/file";
  const dirPathEdit = "./src/files-format";
  const files = fs.readdirSync(dirPath);

  for (let file of files) {
    let data = fs.readFileSync(path.join(dirPath, file), "utf-8");
    let jsonObj = await xml2js.parseStringPromise(data, {
      explicitArray: false,
    });

    let prefixedJsonObj = prefixKeys(jsonObj);

    // Adicione o namespace ans na tag raiz
    if (prefixedJsonObj["ans:mensagemTISS"]) {
      prefixedJsonObj["ans:mensagemTISS"].$["xmlns:ans"] =
        "http://www.ans.gov.br/padroes/tiss/schemas";
    }

    let xml = xmlBuilder.buildObject(prefixedJsonObj);
    fs.writeFileSync(
      path.join(dirPathEdit, `${path.parse(file).name}-formatado.xml`),
      xml
    );
    // Após o processamento, deletar o arquivo original
    fs.unlinkSync(path.join(dirPath, file));
  }
}

function prefixKeys(obj) {
  for (let i in obj) {
    if (typeof obj[i] === "object") {
      obj[i] = prefixKeys(obj[i]);
    }
    if (!i.startsWith("xmlns") && !i.includes(":") && i !== "$") {
      obj["ans:" + i] = obj[i];
      delete obj[i];
    }
  }
  return obj;
}

readAndWriteFiles();
