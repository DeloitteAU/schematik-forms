# Contribute to Schematik Forms

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix.
If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other
people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take over it but you should
still leave a comment.

## Getting started

**Prerequisites**

-   You understand git and github
-   You have `yarn` installed at v1+
-   You have Node installed at `^11.15.0` per the `.nvmrc`
    -   You can run `nvm use` to automatically set the correct version according to the project's `.nvmrc` file, if you're using [nvm](https://github.com/nvm-sh/nvm)
    -   Note this project is currently not compatible with Node 12+ ([GitHub issue](https://github.com/DeloitteDigitalAPAC/schematik-forms/issues/4))

## Development Workflow

After cloning Schematik Forms, run `yarn install` to install the dependencies. Then the following commands will
become available.

-   `yarn start` starts a dev server with the cypress fixtures.
-   `yarn lint` checks code style.
-   `yarn test` runs the test suite.
-   `yarn test:unit` runs the unit tests with jest.
-   `yarn test:cypress` runs the cypress tests.
-   `yarn cypress:open` Starts cypress in interactive mode.
-   `yarn docs` Creates the table of contents for the readme file

### Building the library

Run `yarn build` to build the library. The build will output to `/lib`.

## Submitting Pull Requests

The core maintainers monitor pull request's whom will perform the reviews.

**Before submitting a pull request** please ensure the following is done:

-   Fork the repository and create your branch from `master`.
-   If you've fixed a bug or added a feature, add tests.
-   Ensure the tests pass (`yarn test`).
