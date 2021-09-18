const axios = require('axios').default;
const API_URL = 'https://swapi.dev/api/planets';
const fs = require('fs')
const { promisify } = require('util')

const appendFileAsync = promisify(fs.appendFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

const folderName = './json-files';

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

const generateJsonFile = async () => {
  const searchParams = getParamsForSearch();
  const apiResponseData = JSON.stringify(await getApiData(searchParams));

  const fileDate = getDate();
  await createFolder();
  await appendFileAsync(`${folderName}/${fileDate}-api-data.json`, apiResponseData);
}

generateJsonFile();

