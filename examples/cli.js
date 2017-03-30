var inquirer = require('inquirer');

var examples = {
  'Basic Usage': 'basic-usage',
  'Basic State Access': 'basic-state-access',
  'Submit Handling': 'submit-handling',
  'Validation': 'validation',
  'Initial Values': 'initial-values',
  'Reset Form': 'reset-form',
  'Field Wraps': 'field-wraps',
  'Field Wraps with connectField HoC': 'field-wrap-hoc',
  'Full Featured Example': 'full-featured'
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
