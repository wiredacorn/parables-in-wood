const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const markdown = require("markdown-it")({
  html: true
})


module.exports = function (eleventyConfig) {

  // Slugify
  eleventyConfig.addFilter("slugify", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  // Filter source file names using a glob
  eleventyConfig.addCollection("sculpturesFiles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("sculptures/*.md");
  });

  // Get only content that matches a tag
  // Make collection of all sculptures
  eleventyConfig.addCollection("sculptures", function(collectionApi) {
    return collectionApi.getFilteredByTag("sculptures");
  });

  // Works for Sale Collection
  eleventyConfig.addCollection("forsale", function(collectionApi) {
    return collectionApi.getAll().filter(function(item) {
      // Side-step tags and do your own filtering
      // returns true or false. True => include in results.
      return item.data.forsale;
    });
  });

  // In Progress Collection
  eleventyConfig.addCollection("inprogress", function(collectionApi) {
    return collectionApi.getAll().filter(function(item) {
      // Side-step tags and do your own filtering
      // returns true or false. True => include in results.
      return item.data.inprogress;
    });
  });

  // Filter using `Array.filter`
  // Filter collection based on data
  eleventyConfig.addCollection("keyMustExistInData", function(collectionApi) {
    return collectionApi.getAll().filter(function(item) {
      // Side-step tags and do your own filtering
      // returns true or false. True => include in results.
      return "myCustomDataKey" in item.data;
    });
  });



  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Markdown Filter
  eleventyConfig.addFilter('stringMe', value => {
    return value.replace(/ /g,"").toLowerCase()
  })

  // Markdown Filter
  eleventyConfig.addFilter('markdown', value => {
    return `<div class="md-block">${markdown.render(value)}</div>`    
  })

  // Quotes Style Filter
  eleventyConfig.addFilter('quotes', value => {
    return value.replace(/\<blockquote\>/g, "<blockquote class='max-w-4xl pl-6 px-4 py-4 my-4 ml-4 bg-white text-gray-800'>")
  })

  // Spacing Style Filter
  eleventyConfig.addFilter('spacing', value => {
    return value.replace(/\<p\>/g, "<p class='mb-2'>")
  })

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
