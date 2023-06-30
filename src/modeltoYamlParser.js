const fs = require('fs-extra')
const path = require('path')

let files = []
const isInterface =
  /(export\s+|\/\/\s+|\/\*+\s*)?interface(\s+.+)?\s*\{([^\}]+)\}/g
const propertyExp =
  /[\n\r]?\s*([\w\?\:\s]+)\s*\;?\s*(\/\/\s*[^\s\n\r]+)?\s*[\n\r]/g
const interfaceNameRxp = /interface\s+(\w+)((\s+extends\s+)(\w+))?\s*\{/g

function trim(str) {
  return str ? str.replace(/[\n\r\s]/g, '') : ''
}

function convertTabtoSpace(str) {
  return str.replaceAll('\t', '  ')
}

function gennerateProperties(properties, isQuery) {
  let propertiesStr = ''
  properties.replace(propertyExp, (a) => {
    let [property, annotation] = a.split('//')
    let isRequired = property.indexOf('?:') < 0
    let [key, type] = isRequired ? property.split(':') : property.split('?:')
    type = trim(type)
    type = type.slice(-1) === ';' ? type.slice(0, -1) : type
    annotation = trim(annotation)
    propertiesStr = `${propertiesStr}\t\t\t\t${trim(
      key
    )}:\n\t\t\t\t\ttype: ${type}${
      isRequired ? '' : '\n\t\t\t\t\trequired: false'
    }${annotation ? '\n\t\t\t\t\tdescription: ' + annotation : ''}\n`
    return a
  })
  return propertiesStr
}

function readFiles(path) {
  const files2 = fs.readdirSync(path).filter((item) => {
    if (fs.statSync(path + '/' + item).isDirectory()) {
      readFiles(path + '/' + item)
    }
    if (/(.+)\.(model|controller)\.ts$/.test(item)) {
      return true
    }
    return false
  })
  files = files.concat(files2)
  return files2
}
function generateTypeContent(interfaceItem, interfaceArr) {
  let interfacesStr = ''
  const extendsName = interfaceArr[3]
  const interfaceName = interfaceArr[1]
  interfacesStr = `${interfacesStr}\t\t${interfaceName}:\n\t\t\ttype: object\n\t\t\tproperties:\n`
  let propertiesStr = gennerateProperties(interfaceItem)
  interfacesStr = `${interfacesStr}${propertiesStr}`
  if (interfaceArr[2] === 'extends') {
    interfacesStr = `${interfacesStr}\t\t\tallOf:\n\t\t\t\t- $ref: '#/components/schemas/${extendsName}'\n`
  }
  return interfacesStr
}
function gennerateFileInterfaces(fileContent) {
  const interfaces = fileContent.match(isInterface)
  let interfacesStr = ''
  for (let interfaceItem of interfaces) {
    if (
      interfaceItem.slice(0, 2) === '//' ||
      interfaceItem.slice(0, 2) === '/*'
    ) {
      continue
    }
    const interfaceArr = interfaceItem
      .match(interfaceNameRxp)[0]
      .slice(0, -1)
      .split(/\s+/)
    let interfaceStr = generateTypeContent(interfaceItem, interfaceArr)
    interfacesStr = `${interfacesStr}${interfaceStr}`
  }
  return interfacesStr
}
function modelToYamlParser(rootDir) {
  readFiles(rootDir)
  let yamlstr = `components:\n`
  let schemesStr = '\tschemas:\n'
  for (let file of files) {
    const fileContent = fs.readFileSync(rootDir + '/' + file, {
      encoding: 'utf8'
    })
    const interfacesStr = gennerateFileInterfaces(fileContent)
    schemesStr = `${schemesStr}${interfacesStr}`
  }
  yamlstr = `${yamlstr}${schemesStr}`

  yamlstr = convertTabtoSpace(yamlstr)
  fs.writeFileSync(
    path.resolve(__dirname, './components/moduleA.yaml'),
    yamlstr
  )
}

module.exports = { modelToYamlParser }
