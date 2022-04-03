const child_process = require('child_process');
const inquirer = require('inquirer');
const { str } = require('./data/logo');

(async () => {
  console.log(str + '\n\n');
  const answer = await inquirer.prompt([
    {
      name: 'fileName',
      message:
        'File name containing a list of web app paths that need to be brute-forced against the specified web app URL: ',
      type: 'input',
    },
    {
      name: 'domainNames',
      message: 'Domain that you want to run this bruteforce:',
      type: 'input',
    },
    {
      name: 'statusCodes',
      message: 'Status code interested in: ',
      type: 'input',
    },
  ]);
  let _p;
  answer.domainNames.split(',').forEach((domainName) => {
    _p = child_process.spawn('node', [
      './bin/script.js',
      domainName,
      answer.statusCodes,
      answer.fileName,
    ]);
    _p.on('close', () => {
      console.log('Process completed');
    });
  });
})();
