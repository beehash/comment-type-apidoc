const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const minimist = require("minimist");
const generateOpenApis = require('./src/index');
const args = minimist(process.argv.slice(2));

const projectname = args.project || 'default';
const pagename = args.pagename || 'swagger';
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

const openApiSpec = generateOpenApis();

const swaggerJSpec = {
  ...swaggerDefinition,
  ...openApiSpec,
  info: { ...swaggerDefinition.info },
  openapi: "3.0.3",
};

if(projectname && !fs.existsSync('./swagger-ui/jsons/'+projectname)) {
  fs.mkdirSync('./swagger-ui/jsons/'+projectname);
}

fs.writeFileSync(
  path.resolve(
    __dirname,
    './swagger-ui/jsons/'+ projectname+ '/' + pagename +'.json'
  ),
  JSON.stringify(swaggerJSpec),
);

async function commitCode() {
  const currentBranch = execa.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if(currentBranch === 'master' || currentBranch === 'release-branch') {
    console.log(chalk.red('当前分支'+ currentBranch +'不可操作'));
    return;
  }

  console.log(chalk.blueBright('Committing changes'));
  execa.sync('git', ['add', '-A']);
  execa.sync('git', ['commit', '-m', `release: v${projectname}-${pagename}`]);

  console.log(chalk.blueBright('Pushing to GitLab'));
  execa.sync('git', ['push']);
  console.log('commitCode Complete')
}

// commitCode();

