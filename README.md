# Node-path-finder

This CLI tool can accept multiple URLs from user and file containing list of paths to brute force and as well as multiple status codes to check on.

**Guidelines** :

1.  Run node index.js after cloning this repository.
2.  It will be interactive, so multiple values should be supplied if needed separated with comma.
    eg: https://www.geeksforgeeks.org,https://github.com
3.  status codes also accepts multiple values.

**Features** :

1.  Bonus feature was added. If multiple urls are supplied this cli app spawns multiple processes to run simultaneously and can brute force in parallel
2.  Instead of brute forcing path one-by-one, This tool requests in parallel as a batch of 5, and streams output to a csv file containing output of status code, requested full URL and status text.

**Requirement**

1. Make sure nodejs is installed
2. cd into project root and run npm install
3. run node index.js
