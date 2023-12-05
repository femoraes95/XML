const fs = require('fs');
const { parseString } = require('xml2js');
const moment = require('moment');
const { JSDOM } = require('jsdom');

// Função para ler o arquivo XML e gerar o resumo financeiro
function generateFinancialSummary(xmlFilePath) {
  fs.readFile(xmlFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo XML:', err);
      return;
    }

    parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('Erro ao analisar o XML:', parseErr);
        return;
      }

      // Extrair informações do XML e gerar o resumo financeiro
      const transactions =
        result['ans:mensagemTISS']['ans:operadoraParaPrestador'];
      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach((transaction) => {
        console.log(transaction);
        const amount = parseFloat(transaction.Amount[0]);

        if (amount > 0) {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
      });

      // Criar o HTML para exibir o resumo financeiro
      const html = `
        <html>
          <head>
            <title>Resumo Financeiro</title>
            <style>
              table {
                border-collapse: collapse;
              }
              th, td {
                padding: 8px;
                border: 1px solid black;
              }
            </style>
          </head>
          <body>
            <h1>Resumo Financeiro</h1>
            <table>
              <tr>
                <th>Total de Receitas</th>
                <td>${totalIncome}</td>
              </tr>
              <tr>
                <th>Total de Despesas</th>
                <td>${totalExpense}</td>
              </tr>
              <tr>
                <th>Saldo</th>
                <td>${totalIncome + totalExpense}</td>
              </tr>
            </table>
          </body>
        </html>
      `;

      // Salvar o HTML em um arquivo
      fs.writeFile('resumo_financeiro.html', html, (writeErr) => {
        if (writeErr) {
          console.error('Erro ao escrever o arquivo HTML:', writeErr);
          return;
        }

        console.log(
          'O arquivo "resumo_financeiro.html" foi gerado com sucesso!'
        );
      });
    });
  });
}

// Caminho do arquivo XML
const xmlFilePath = './11898.xml';

// Chamar a função para gerar o resumo financeiro
generateFinancialSummary(xmlFilePath);
