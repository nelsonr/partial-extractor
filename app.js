const path = require('path');
const generatePartials = require('./generate_partials');

generatePartials({
    filename: 'index.html',
    srcPath: path.join(__dirname),
    outPath: path.join(__dirname, 'build'),
});