import generatePartials from '../src/generate_partials.ts';

generatePartials({
    filename: 'template.html',
    srcPath: './example/src',
    outPath: './example/build'
});