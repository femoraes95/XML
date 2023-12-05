module.exports = {
  apps: [
    {
      name: "formatFile",
      script: "src/formatFile.js",
      watch: ["src/file"],
      ignore_watch: ["node_modules", "src/files-formatado", "*.log", "!*.xml"],
      watch_options: {
        followSymlinks: false,
        usePolling: true,
        interval: 1000, // Intervalo de verificação em milissegundos
        binaryInterval: 1000, // Intervalo de verificação para arquivos binários
        ignoreInitial: true, // Ignorar o estado inicial (não iniciar o script na primeira execução do PM2)
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100,
        },
      },
    },
  ],
};
