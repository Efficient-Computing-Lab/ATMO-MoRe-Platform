# ATMO-MoRe Platform
The special platform developed in the context of the ATMO-MoRe project. It provides the necessary dashboards that allow the user to manage and use the features provided by the underlying ATMO-MoRe models.

## Installation

### Requirements

The following software is required:

* Docker
* Python V3.12

### Configuration 

After downloading the source code from git you will need to configure some parameters in the .env file.
The parameters are the following:

* DATASTORE_PATH : The filepath of datastore.
* DATASTORE_SUPPLY_INFO : The filepath of the ATM supply info in xlsx format, relative to the DATASTORE_PATH.
* DATASTORE_SUPPLY_TEST_INFO : The filepath of the ATM supply info for evaluation in xlsx format, relative to the DATASTORE_PATH.
* DATASTORE_OUTAGE_INFO : The filepath of the ATM outage info, relative to the DATASTORE_PATH.
* RESULTS_PATH : The filepath to place the results of the model executions.

In order to successfully create the MongoDB container using docker compose and then use it you will need to setup a local MongoDB and provide the following parameters:

* MONGO_INITDB_ROOT_USERNAME : The MongoDB username to set in the newly created MongoDB container.
* MONGO_INITDB_ROOT_PASSWORD : The MongoDB password to set in the newly created MongoDB container.
* MONGO_INITDB_DATABASE : The MongoDB database to initiate in the newly created MongoDB container.
* MONGO_USERNAME : The MongoDB username.
* MONGO_PASSWORD : The MongoDB password.
* MONGO_DATABASE : The MongoDB database.
* MONGO_AUTH_DB : The MongoDB authentication database.
* MONGO_HOST : The MongoDB host.
* MONGO_PORT : The MongoDB port.

If you want to use PostgreSQL as the Django database you also need to set the following parameters:

* POSTGRES_USER : The PostgreSQL username.
* POSTGRES_PASSWORD : The PostgreSQL password.
* POSTGRES_DB : The PostgreSQL database.
* POSTGRES_HOST : The PostgreSQL host.
* POSTGRES_PORT : The PostgreSQL port.

Finally, you need to set the following parameters in order to have improved container logs:

* PYTHONUNBUFFERED : 1
* PYTHONIOENCODING : UTF-8

### Docker

The recomented way to install and use the platform is through Docker compose. The instruction for installation are the following:

* Download the source code using git.
* Change directory to the root folder of the source.
* Execute the command `docker compose up --build -d`. It may need `sudo` rights depending on system setup.
* After the container is running you can navigate to `http://localhost:3000` and start using the platform.

## Licence

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.