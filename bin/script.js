const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

(async () => {
  try {
    const domainName = process.argv[2];
    const fileName = process.argv[4];

    const outputPath = path.resolve(
      module.path,
      `../out/${new URL(domainName).hostname}.csv`
    );
    console.log(outputPath);
    let arr = []; // array buffer for holding 5 promises at a time
    let filteredValues = []; // filtered values from promise.all()
    const statusCodes = process.argv[3].split(',').map((el) => el * 1); // splitting and converting to INT

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
          outputPath,
          [status, url, statusText].join(',') + '\n'
        );
      });
    }

    var lines = fs
      .readFileSync(path.resolve(module.path, `../data/${fileName}`), 'utf-8')
      .split('\n')
      .filter(Boolean);

    if (fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, '');
    }

    for (let i = 0; i < lines.length; i++) {
      // for i  loop is promise aware

      const line = lines[i];
      arr.push(fetch(`${domainName || 'https://github.com'}/${line}`));
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
    console.log(err);
    console.log(
      'Rate Limiter may be on, Please try other domain or after sometimes.'
    );
  }
})();

// http://github.com
