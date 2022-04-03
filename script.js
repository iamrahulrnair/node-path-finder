const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require('node-fetch');

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

    let arr = []; // array buffer for holding 5 promises at a time
    let filteredValues = []; // filtered values from promise.all()
    const statusCodes = answer.statusCodes.split(',').map((el) => el * 1); // splitting and converting to INT

    async function publishResponse() {
      /**
       * This handles all the promises in the buffer,
       *  and appends to the file
       */
      const values = await Promise.all(arr);
      filteredValues = await values.filter((value) =>
        statusCodes.includes(value.status)
      );

      filteredValues.map(({ status, url, statusText }) => {
        fs.appendFileSync(
          module.path + '/out/output.csv',
          [status, url, statusText].join(',') + '\n'
        );
      });
    }

    var lines = fs
      .readFileSync(module.path + '/data/wordList.txt', 'utf-8')
      .split('\n')
      .filter(Boolean);

    if (fs.existsSync(module.path + '/out/output.csv')) {
      fs.writeFileSync(module.path + '/out/output.csv', '');
    }

    for (let i = 0; i < lines.length; i++) {
      // for i  loop is promise aware

      const line = lines[i];
      arr.push(fetch(`${answer.domainName || 'https://github.com'}/${line}`));
      if (arr.length % 5 == 0) {
        await publishResponse();
        while (arr.length > 0) {
          arr.pop();
        }
      }
    }

    /**
     * This call is made for arr.length % 5 != 0,
     * ie,elements in the array buffer
     *  */

    await publishResponse();
  } catch (err) {
    console.log(
      'Rate Limiter may be on, Please try other domain or after sometimes.'
    );
  }
})();

// http://github.com
