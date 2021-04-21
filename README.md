## What's this?

A simple tool to help generate partials for HTML email templates. Very useful when used in combination with a tool like [MJML](https://mjml.io/).

## How does it work?

Wrap any content in your template with a special HTML comment to indicate the beginning and the end of the partial:

```html
<h1>My TODO</h1>
<ol>
    <!-- partial todo_item name todo_list -->
    <li>${text}</li>
    <!-- /partial todo_item -->
</ol>
```

The first argument is the filename of the partial. In the example above, `todo_item` will create a partial file `_todo_item.html`.

The second argument (`name todo_list`) is the name of the template variable that will replace the partial block in the template. This argument is **optional**. If omitted, the template variable will be named after the partial filename.

Finally, to generate the partials, call the `generatePartials` function on the template file.

```js
generatePartials({
    filename: 'template.html',
    srcPath: path.join(__dirname),
    outPath: path.join(__dirname, 'build')
});
```