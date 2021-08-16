# E-Learning Platrom
App which provides End-2-End learning resources.

## Current Features

1. Admin Task Backend API for generating Subtraction questions.
* API Endpoint ```POST {{baseURL}}/api/maths/numbers/subtract-question-generator``` <br/>
Payload <br/>
``` 
totalQuestions:2
minuedLength:3
subtrahendLength:3
hasBorrowing:false
```
`Note`: Currently there is no validation of `totalQuestions` input. There should not be `invalid` number. `Invalid number` input will crash the server.

<br/>
<br/>
<br/>

## How to run server in `localhost` in `development` mode:
1. Clone the Repo.
2. Go to app root directory.
3. Run ```npm install```
4. Run ```npm start```
5. Go to [localhost:4500](http://localhost:4500)



## How to create `Docker Image`, run
1. Clone the Repo.
2. Run `npm run docker-build`
3. Run `npm run docker-run`
4. Go to [localhost:4500](http://localhost:4500)





