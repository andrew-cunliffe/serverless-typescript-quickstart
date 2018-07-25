## Serverless Typescript Quickstart

This is a quickstart example for build an API using Serverless and Typescript

[![CircleCI](https://circleci.com/gh/andrew-cunliffe/serverless-typescript-quickstart.svg?style=svg)](https://circleci.com/gh/andrew-cunliffe/serverless-typescript-quickstart)
 
Underlying technologies and frameworks - Node, Serverless, Express, Typescript, Cucumber

### Requirements

- Node 8

### Available commands

- npm install  
  Installs required dependencies, must always be run before any other commands will work

- npm run test  
  This uses express directly to execute the functional tests
  
- npm start  
  Runs serverless offline locally to allow for development of UI
  
- npm deploy:test  
  Performs a deployment to the test environment
  
### Deployment

This is performed via Circle CI and uses the scripts `npm run test` and `npm run deploy:prod` to perform required checks and deployments
