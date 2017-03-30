var inquirer = require('inquirer');

var examples = {
  'Basic Usage': 'basic-usage',
  'Basic State Access': 'basic-state-access',
  'Field Wraps': 'field-wraps',
  'Validation': 'validation',
  'Submit Handling': 'submit-handling',
  'Initial Values': 'initial-values'
}

inquirer.prompt([{
  type: 'list',
  name: 'example',
  message: 'Which Example?',
  choices: Object.keys(examples)
}]).then(function(answers) {
  process.env.EXAMPLE = examples[answers.example]
  var server = require('./server')
});
