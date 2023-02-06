const genOpenApi = require("openapi-comment-parser");
const path = require("path");
const minimist = require("minimist");
const rootDir = path.resolve(__dirname, "../src");
const modelToYamlParser = require("./modelToYamlParser");
const args = minimist(process.argv.slice(2));

modules = args._;
if (args._.length > 0) {
  for (let arg of args) {
    modelToYamlParser(rootDir + "/" + arg);
  }
}

function generateOpenApis() {
  const paths = [];
  if (args._.length > 0) {
    for (const mod of args._) {
      paths.push("../src/" + mod + "/**/*.controller.ts");
    }
  } else {
    paths.push("../src/**/*.controller.ts");
  }
  console.log(paths);
  const openApiSpec = genOpenApi({
    include: ["./components/**/*.yaml", ...paths],
  });
  return openApiSpec;
}

module.exports.default = generateOpenApis;
