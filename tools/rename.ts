const { rm } = require('shelljs');
const replace = require('replace-in-file');
const prompts = require('prompts');

const files = ['**/*.md', '**/*.json', '**/*.yml'];

async function run() {
  const { username } = await prompts({
    type: 'text',
    name: 'username',
    message: 'What is your Github username?',
  });

  replace.sync({
    files,
    //Replacement to make (string or regex)
    from: /chaoyangnz/g,
    to: username,
  });

  const { library } = await prompts({
    type: 'text',
    name: 'library',
    message: 'What do you want the library to be called? (use kebab-case)',
  });

  replace.sync({
    files,
    //Replacement to make (string or regex)
    from: /node-library-template/g,
    to: library,
  });

  replace.sync({
    files: ['package*.json'],
    //Replacement to make (string or regex)
    from: /ts\-node tools\/rename\.ts/g,
    to: '',
  });
  rm('-rf', 'tools')

  console.log('All done! Enjoy');
}

run();
