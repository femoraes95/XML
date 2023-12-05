const chokidar = require("chokidar");
const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

// Defina o diretório que você deseja monitorar
const directoryToWatch = "./src/file";

// Inicialize o watcher
const watcher = chokidar.watch(directoryToWatch, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

// Filtre apenas os eventos relacionados a arquivos XML
const isXmlFile = (path) => path.endsWith(".xml");

const xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true },
  headless: true,
});

// Evento para adição de arquivos
watcher.on("add", (pathApp) => {
  if (isXmlFile(pathApp)) {
    console.log(`Arquivo ${pathApp} foi adicionado`);

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
  }
});

// Evento para mudanças nos arquivos
watcher.on("change", (path) => {
  if (isXmlFile(path)) {
    console.log(`Arquivo ${path} foi alterado`);
  }
});

// Evento para remoção de arquivos
watcher.on("unlink", (path) => {
  if (isXmlFile(path)) {
    console.log(`Arquivo ${path} foi removido`);
  }
});

console.log(
  `Aguardando por mudanças nos arquivos XML em ${directoryToWatch}...`
);
