const core = require('@actions/core');
const github = require('@actions/github');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const randomItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const animalAPIConfigs = {
  cats: {
    randomImageEndpoint: 'https://api.thecatapi.com/v1/images/search',
    emoji: ':cat2:',
    jsonParserFunc: function(json) {
      return json[0].url;
    }
  },
  dogs: {
    randomImageEndpoint: 'https://dog.ceo/api/breeds/image/random',
    emoji: ':dog2:',
    jsonParserFunc: function(json) {
      return json.message;
    }
  },
  foxes: {
    randomImageEndpoint: 'https://randomfox.ca/floof/',
    emoji: ':fox_face:',
    jsonParserFunc: function(json) {
      return json.image;
    }
  }
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
    // Log which animal
    console.log(`Fetching image for ${randomAnimal}`);

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
  } catch (error) {
    console.error(error.message);
  }
};

// Run action
(async() => {
  main();
})();
