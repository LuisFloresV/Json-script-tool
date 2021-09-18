const axios = require('axios').default;
const API_URL = 'https://swapi.dev/api/planets';
const fs = require('fs')
const { promisify } = require('util')
const converter = require('json-2-csv');

const appendFileAsync = promisify(fs.appendFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

const folderName = './files';

const getApiData = async (params) => {
  try {
    const fetchedData = await axios.get(`${API_URL}${params}`);
    return fetchedData.data.results;
  } catch (error) {
    throw new Error(error);
  }
};

const getDate = () => new Date().toISOString();

const getParamsForSearch = () => process.argv.slice(2);

const createFolder = async () => {
  if (!await existsAsync(folderName)) {
    await mkdirAsync(folderName);
  }
  return;
}

const generateJsonFile = async (fileDate, apiResponseData) => await appendFileAsync(`${folderName}/${fileDate}-api-data.json`, apiResponseData);


const generateCsvFile = async (fileDate, apiResponseData) => {
  const csvFileData = await converter.json2csvAsync(JSON.parse(apiResponseData))
  await appendFileAsync(`${folderName}/${fileDate}-api-data.csv`, csvFileData)
}

const generateFiles = async () => {
  const searchParams = getParamsForSearch();
  const apiResponseData = JSON.stringify(await getApiData(searchParams));

  await createFolder();
  const fileDate = getDate();

  await generateJsonFile(fileDate, apiResponseData);
  await generateCsvFile(fileDate, apiResponseData);
}

generateFiles();

