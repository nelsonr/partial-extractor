const fs = require('fs');
const path = require('path');

function extractPartials(options) {
    const defaults = {
        filename: '',
        srcPath: '',
        outPath: '',
    };

    options = Object.assign(defaults, options);

    const partialRegex = /<!-- partial ([\w_]+) -->(.*?)<!-- \/partial \1 -->/gs;

    fs.readFile(path.join(options.srcPath, options.filename), 'utf-8', (err, buff) => {
        let partialMatch;
        let matchFound = false;
        let out = buff;

        // Calling exec on the regular expression multiple times iterates on all the matches, one at time
        while ((partialMatch = partialRegex.exec(buff)) !== null) {
            matchFound = true;

            // This is necessary to avoid infinite loops with zero-width matches
            if (partialMatch.index === partialRegex.lastIndex) {
                partialRegex.lastIndex++;
            }

            const [content, name, partial] = partialMatch;
            out = out.replace(content, `\$\{${name}\}`);

            fs.writeFileSync(path.join(options.outPath, `_${name}.html`), partial);

            extractPartials({
                filename: `_${name}.html`,
                srcPath: options.outPath,
                outPath: options.outPath,
            });
        }

        if (matchFound) {
            fs.writeFileSync(path.join(options.outPath, options.filename), out);
        }
    });

    return true;
}

extractPartials({
    filename: 'index.html',
    outPath: 'build'
});
