const fs = require('fs');
const path = require('path');

/**
 * Generate partials for HTML email templates 
 * 
 * Create a HTML comment with the following syntax around any content: 
 * 
 * ```html
 * <!-- partial filename name placeholder -->
 *  Hello World!
 * <!-- /partial filename -->
 * ```
 * 
 * where the `filename` is the filename for the partial and `placeholder` is the name of the template variable
 * that should replace the content
 * 
 * @param {Object} options Check the `defaults` object for the available options
 * @returns {Boolean} True
 */
function generatePartials(options) {
    const defaults = {
        filename: '',
        srcPath: '',
        outPath: '',
    };

    options = Object.assign(defaults, options);

    const partialRegex = /<!-- partial ([\w_]+) name ([\w_]+) -->(.*?)<!-- \/partial \1 -->/gs;
    const fileData = fs.readFileSync(path.join(options.srcPath, options.filename), 'utf-8');

    let partialMatch;
    let matchFound = false;
    let out = fileData;

    console.log('Extracting partials from file: ', options.filename);

    if (!fs.existsSync(options.outPath)) {
        fs.mkdirSync(options.outPath);
    }

    // Calling exec on the regular expression multiple times iterates on all the matches, one at time
    while ((partialMatch = partialRegex.exec(fileData)) !== null) {
        matchFound = true;

        // This is necessary to avoid infinite loops with zero-width matches
        if (partialMatch.index === partialRegex.lastIndex) {
            partialRegex.lastIndex++;
        }

        const [content, filename, name, partial] = partialMatch;
        out = out.replace(content, `\$\{${name}\}`);

        fs.writeFileSync(path.join(options.outPath, `_${filename}.html`), partial);

        // Check the partial file for additional partials
        generatePartials({
            filename: `_${filename}.html`,
            srcPath: options.outPath,
            outPath: options.outPath,
        });
    }

    if (matchFound) {
        fs.writeFileSync(path.join(options.outPath, options.filename), out);
    }

    return true;
}

module.exports = generatePartials;
