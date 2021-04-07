const fs = require('fs');
const path = require('path');

const partialRegex = /<!-- partial name: ([\w_]+) placeholder: ([\w_]+) -->(.*?)<!-- end partial -->/gs;

fs.readFile('index.html', 'utf-8', (err, buff) => {
    let partialMatch;
    let out = buff;

    // Calling exec on the regular expression multiple times iterates on all the matches, one at time
    while ((partialMatch = partialRegex.exec(buff)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (partialMatch.index === partialRegex.lastIndex) {
            partialRegex.lastIndex++;
        }

        const [content, name, placeholder, partial] = partialMatch;
        out = out.replace(content, `\$\{${placeholder}\}`);

        fs.writeFileSync(path.join('build', `_${name}.html`), partial);
    }

    fs.writeFileSync(path.join('build', `index.html`), out);
});