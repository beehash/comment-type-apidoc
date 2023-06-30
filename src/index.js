const genOpenApi = require("openapi-comment-parser");
const path = require("path");
const fs = require('fs-extra');
const { modelToYamlParser } = require("./modelToYamlParser");

function generateOpenApis(rootDir, modules) {
  const paths = [];
  if (modules.length > 0) {
    for (const mod of modules) {
      modelToYamlParser(rootDir + "/" + module);
      paths.push("./src/" + mod + "/**/*.controller.ts");
    }
  } else {
    // const files = fs.readdirSync(rootDir);
    modelToYamlParser(rootDir);
    paths.push("./src/**/*.controller.ts");
  }
  const openApiSpec = genOpenApi({
    cwd: process.cwd(),
    include: ["./components/**/*.yaml", ...paths],
  });
  const componentsSpec = genOpenApi({
    cwd: path.resolve(__dirname, './'),
    include: ["./components/**/*.yaml"]
  });

  openApiSpec.components = componentsSpec.components;
  return openApiSpec;
}

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "专业空间API",
    version: "1.0.0",
    description: "API",
  },
  host: "localhost:3001",
  basePath: "/",
};



function generateSwaggerSpec(rootDir, pagename, modules) {
  const openApiSpec = generateOpenApis(rootDir, modules);

  const swaggerJSpec = {
    ...swaggerDefinition,
    ...openApiSpec,
    info: { ...swaggerDefinition.info },
    openapi: "3.0.3",
  };

  fs.writeFileSync(
    path.resolve(
      __dirname,
      '../swagger-ui/jsons/' + pagename +'.json'
    ),
    JSON.stringify(swaggerJSpec),
  );
}

module.exports = {
  generateSwaggerSpec,
};

