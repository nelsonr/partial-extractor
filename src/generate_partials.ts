import { ensureDirSync } from "https://deno.land/std@0.151.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.151.0/path/mod.ts";

const { readFileSync, writeFileSync } = Deno;

interface Options {
    filename: string;
    srcPath: string;
    outPath: string;
}

/**
 * Generate partials for HTML email templates
 *
 * Create a HTML comment with the following syntax around any content:
 *
 * ```html
 * <!-- partial filename placeholder -->
 * Hello World!
 * <!-- /partial filename -->
 * ```
 *
 * where the `filename` is the filename for the partial and `placeholder` is the name of the template variable
 * that should replace the content
 * 
 * If the `placeholder` is ommited the template variable name will be equal to the `filename`.
 * 
 *  ```html
 * <!-- partial filename -->
 * Hello World!
 * <!-- /partial filename -->
 * ```
 *
 * @param {Object} options Must include template filename and both source and destination paths
 * 
 * @returns {Boolean} True
 */
function generatePartials(options: Options): boolean {
    if (!options.filename) { throw new Error('No filename provided!'); }
    if (!options.srcPath) { throw new Error('No source path provided!'); }
    if (!options.outPath) { throw new Error('No output path provided!'); }

    const textDecoder = new TextDecoder('utf-8');
    const textEncoder = new TextEncoder();

    const partialRegex = /<!-- partial ([\w_]+) ?(?:([\w_]+))? -->(.*?)<!-- \/partial \1 -->/gs;
    const delimiters = { start: '${', end: '}' };
    
    const inputFilePath = path.join(options.srcPath, options.filename);
    const outputFilePath = path.join(options.outPath, options.filename);

    const rawFileData = readFileSync(inputFilePath);
    const fileData = textDecoder.decode(rawFileData);

    ensureDirSync(options.outPath);

    console.log('Extracting partials from file: ', inputFilePath);

    let partialMatch;
    let matchFound = false;
    let out = fileData;
    
    // Calling exec on the regular expression multiple times iterates on all the matches, one at time
    while ((partialMatch = partialRegex.exec(fileData)) !== null) {
        matchFound = true;

        // This is necessary to avoid infinite loops with zero-width matches
        if (partialMatch.index === partialRegex.lastIndex) {
            partialRegex.lastIndex++;
        }

        let [content, filename, name, partial] = partialMatch;
        name = name ? name : filename;

        out = out.replace(content, `${delimiters.start}${name}${delimiters.end}`);

        writeFileSync(path.join(options.outPath, `_${filename}.html`), textEncoder.encode(partial));

        // Check the partial file for additional partials
        generatePartials({
            filename: `_${filename}.html`,
            srcPath: options.outPath,
            outPath: options.outPath,
        });
    }

    if (matchFound) {
        writeFileSync(outputFilePath, textEncoder.encode(out));
    }

    return true;
}

export default generatePartials;
