import { xml2json } from 'xml2json-light';

function processParsedData(data, type, category) {
  let processData = {};

  switch (type) {
    case '.csv':
      processData = processCSVData(data);
      break;
    case '.json':
      processData = processJSONData(data);
      break;
    case '.xml':
      processData = processXMLData(data, category);
      break;
  }

  switch (category) {
    case 'observation':
      processData = getTargetAttributeList('病歷號', processData)
        .map(patientId => {
          return processData.filter(data => data['病歷號'] === patientId);
        })
        .map(data => {
          return {
            ...data[0],
            內容集合: transformObservation(data),
          };
        });
      break;
    case 'patient':
      break;
  }

  return processData;
}

function processCSVData(allText) {
  const allTextLines = allText.split(/\r\n|\n/);
  const headers = allTextLines[0].split(',');
  const lines = [];
  for (let i = 1; i < allTextLines.length; i++) {
    const data = allTextLines[i].split(',');
    if (data.length == headers.length) {
      const tarr = {};
      for (let j = 0; j < headers.length; j++) {
        tarr[headers[j]] = data[j];
      }
      lines.push(tarr);
    }
  }
  return lines;
}

function processJSONData(allText) {
  const data = JSON.parse(allText);
  for (let i in data) {
    if (typeof data[i]['就醫or入院日期'] !== 'undefined') {
      data[i]['就醫日期/入院日期'] = data[i]['就醫or入院日期'];
      delete data[i]['就醫or入院日期'];
    }
  }
  return data;
}

function processXMLData(str, category) {
  const jsonData = xml2json(str);
  let data;
  switch (category) {
    case 'observation':
      data = jsonData['骨密']['row'];
      break;
    case 'patient':
      data = jsonData['標準化病人']['Patient'];
      break;
  }

  for (let i in data) {
    if (typeof data[i]['就醫or入院日期'] !== 'undefined') {
      data[i]['就醫日期/入院日期'] = data[i]['就醫or入院日期'];
      delete data[i]['就醫or入院日期'];
    }
  }
  return data;
}

function getTargetAttributeList(targetAttribute, dataList) {
  const targetData = dataList
    .map(data => data[targetAttribute])
    .filter((ele, index, arr) => arr.indexOf(ele) === index);

  if (!targetData.every(ele => ele != null)) return null;

  return targetData;
}

function transformObservation(dataGroup) {
  const observation = {};
  dataGroup.forEach(data => {
    const attrName = data['名稱縮寫'];
    observation[attrName] = data['內容值'];
  });
  return observation;
}

export default processParsedData;
