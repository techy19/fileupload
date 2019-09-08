# fileupload

### Node express based repository to upload files
#### Packages Used
* body-parser
* config
* dotenv
* express
* fs-extra
* multer
* pg
* pg-format

## `yarn install` to add packages/node_modules

To run the server
* Run sh file `sh setup.sh`, server starts at `5001`

*This will create a dockerized postgres database and will spin the container on 5433 with the required schema in database. This will also start the server after 5 seconds.*
* Next time onwards you can easily do `yarn start`

* To fire test cases, run `sh setuptest.sh`

*This will also create a dockerized postgres test database on port 5434*
* `yarn test` to run the test cases and generate coverage report using `nyc mocha chai`
