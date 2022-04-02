const inquirer = require('inquirer');
const fs = require('fs');
const readline = require('readline');
const fetch = require('node-fetch');
const { setTimeout } = require('timers');

(async () => {
  try {
    const answer = await inquirer.prompt([
      {
        name: 'domainName',
        message: 'Domain that you want to run this bruteforce:',
        type: 'input',
      },
      {
        name: 'statusCodes',
        message: 'Status code interested in: ',
        type: 'input',
      },
    ]);

    // splitting and converting to one

    const statusCodes = answer.statusCodes.split(',').map((el) => el * 1);
    const file = readline.createInterface({
      input: fs.createReadStream(module.path + '/data/wordList.txt'),
    });
    const arr = [];
    file.on('line', async (line) => {
      await arr.push(
        fetch(`${answer.domainName || 'https://github.com'}/${line}`)
      );
    });
    file.on('close', async () => {
      const values = await Promise.all(arr);
      const filteredValues = values.filter((value) =>
        statusCodes.includes(value.status)
      );
      filteredValues.map(({ status, url, statusText }) => {
        fs.appendFileSync(
          module.path + '/out/output.csv',
          [status, url, statusText].join(',') + '\n'
        );
        console.log({ status, url, statusText });
      });
    });
  } catch (err) {
    console.log(err);
  }
})();

// http://github.com
