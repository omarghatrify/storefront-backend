# Getting Started


## Enviroment Variables
- Backend port is set to ``3000`` in ``.env`` file.
- Postgres port is set to ``5444:5432`` in ``docker-compose.yml``.
```
# DEV/PROD
ENV=DEV
API_PORT=3000

# Production (Default) Database
POSTGRES_HOST=postgres
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
POSTGRES_DB=shopping
POSTGRES_PORT=5432

# Development Database
POSTGRES_DEV_HOST=postgres
POSTGRES_DEV_USER=shopping_user_dev
POSTGRES_DEV_PASSWORD=password123
POSTGRES_DEV_DB=shopping_dev
POSTGRES_DEV_PORT=5432

# Testing Database
POSTGRES_TEST_HOST=postgres
POSTGRES_TEST_USER=shopping_user_test
POSTGRES_TEST_PASSWORD=password123
POSTGRES_TEST_DB=shopping_test
POSTGRES_TEST_PORT=5432

# Bcrypt Configuration
BCRYPT_PASSWORD=c6e4mjd@QpC7a42+7Lg8
SALT_ROUNDS=10

# JWT Configuration
TOKEN_SECRET=pNYp4qusA7PHDQ+&4=bQ
```

## Database Setup

1. Use the included docker-compose to run the database server. Or use your own database server.
2. Execute the sql queries below to initiate the 'shopping_dev' and 'shopping_test' databases.
```
CREATE USER shopping_user_dev WITH PASSWORD 'password123';
CREATE DATABASE shopping_dev;
GRANT ALL PRIVILEGES ON DATABASE shopping_dev TO shopping_user_dev;

CREATE USER shopping_user_test WITH PASSWORD 'password123';
CREATE DATABASE shopping_test;
GRANT ALL PRIVILEGES ON DATABASE shopping_test TO shopping_user_test;
```

## API Server Setup

After cloning the project, You can run the API server either on your local enviroment or as a docker container.

### Docker

1. Use the included docker-compose to run the API server.
2. In the docker container, execute ``node node_modules/db-migrate/bin/db-migrate up``

### Local

In the project's root directory,
1. Edit the ``.env`` hosts and ports configuartion.
2. Install npm packages
   ```
   npm install
   ```
3. Migrate Database
    ```
    db-migrate up
    ``` 


## Build and Run

- Start
  ```
  npm run start
  ```
- Start in watch mode
  ```
  npm run watch
  ```
- Start tests
  ```
  npm run test
  ```