const fs = require('fs');
const path = require('path');

const partialRegex = /<!-- partial name: ([\w_]+) placeholder: ([\w_]+) -->(.*)<!-- end partial -->/s;

fs.readFile('index.html', 'utf-8', (err, buff) => {
    const partialMatch = buff.match(partialRegex)

    if (partialMatch !== null) {
        const name = partialMatch[1];
        const placeholder = partialMatch[2];
        const content = partialMatch[3];
        const replacement = buff.replace(partialMatch[0], `\$\{${placeholder}\}`);

        fs.writeFileSync(path.join('build', `_${name}.html`), content);
        fs.writeFileSync(path.join('build', `index.html`), replacement);
    }
});