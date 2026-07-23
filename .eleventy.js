const fs = require("fs");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");

  // Expose each JSON content file as global data under its filename
  const contentDir = "content";
  fs.readdirSync(contentDir).forEach((file) => {
    if (file.endsWith(".json")) {
      const key = file.replace(".json", "");
      eleventyConfig.addGlobalData(key, () => {
        return JSON.parse(fs.readFileSync(`${contentDir}/${file}`, "utf-8"));
      });
    }
  });

  // Procedures collection, sorted by "order" front-matter field
  eleventyConfig.addCollection("procedures", (collectionApi) => {
    return collectionApi.getFilteredByGlob("content/procedures/*.md").sort((a, b) => {
      return (a.data.order || 0) - (b.data.order || 0);
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
