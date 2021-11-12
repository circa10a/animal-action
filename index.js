const core = require('@actions/core');
const github = require('@actions/github');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const randomItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const someRandomAPIBaseURL = 'https://some-random-api.ml/animal';
const someRandomAPIJSONImageParserFunction =  function(json) {
  return json.image;
};

const animalAPIConfigs = {
  cats: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/cat`,
    emoji: ':cat2:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  dogs: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/dog`,
    emoji: ':dog2:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  foxes: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/fox`,
    emoji: ':fox_face:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  koalas: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/koala`,
    emoji: ':koala:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  pandas: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/panda`,
    emoji: ':panda_face:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  birds: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/bird`,
    emoji: ':bird:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  raccoons: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/raccoon`,
    emoji: ':raccoon:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  kangaroos: {
    randomImageEndpoint: `${someRandomAPIBaseURL}/kangaroo`,
    emoji: ':kangaroo:',
    jsonParserFunc: someRandomAPIJSONImageParserFunction
  },
  shibas: {
    randomImageEndpoint: 'http://shibe.online/api/shibes',
    emoji: ':dog2:',
    jsonParserFunc: function(json) {
      return json[0];
    }
  },
};

const main = async() => {
  try {
    // Inputs
    const githubToken = core.getInput('github_token', { required: true });
    const animals = core.getInput('animals').split(',');
    const pullRequestComment = core.getInput('pull_request_comment');

    // Get repo details
    const octokit = github.getOctokit(githubToken);
    const context = github.context;

    if (!context.payload.pull_request) {
      console.error('Not a pull request');
      return;
    }

    // Get random animal from input (comma delimited string)
    const randomAnimal = randomItemFromArray(Object.values(animals));
    // If not in config map, not supported, bail early
    if (!animalAPIConfigs[randomAnimal]) {
      console.error(`Animal: ${randomAnimal} not supported. Skipping.`);
      return;
    }

    // Get animal config to call API
    const randomAnimalConfig = animalAPIConfigs[randomAnimal];
    // Get image link for random animal
    const response = await fetch(randomAnimalConfig.randomImageEndpoint, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
      }
    });

    // Parse JSON
    const responseJSON = await response.json();
    const randomAnimalImageLink = randomAnimalConfig.jsonParserFunc(responseJSON);

    // Create comment to go in PR
    const msg = `${pullRequestComment} ${randomAnimalConfig.emoji}\n\n![alt text](${randomAnimalImageLink})`;
    const resp = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: context.issue.number,
      body: msg,
    });
    console.log(resp);
  } catch (error) {
    console.error(error.message);
  }
};

// Run action
(async() => {
  main();
})();
