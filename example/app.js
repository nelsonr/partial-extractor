const path = require('path');
const generatePartials = require('../src/generate_partials');

generatePartials({
    filename: 'template.html',
    srcPath: path.join(__dirname),
    outPath: path.join(__dirname, 'build')
});