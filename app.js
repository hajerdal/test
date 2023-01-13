// Requiring module
const express = require('express');
const jsonFile = require('./jsonTest.json');
// Creating express object
const app = express();

// Handling GET request
// ?transactionId=:transactionId&confidenceLevel=:confidenceLevel
app.get('/api/transactions', (req, res) => {
  console.log('res', req.query);
  const transactionId = req.query.transactionId;
  const confidenceLevel = req.query.confidenceLevel;

  const resultat = recusion(
    jsonFile,
    transactionId,
    parseFloat(confidenceLevel)
  );
  res.json(resultat);
  res.send(resultat);
  //res.json(filterByConfidence(jsonFile, confidenceLevel));
});

// Port Number
const PORT = process.env.PORT || 5000;

// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));

function recusion(item, id, level) {
  let finalResult = [];

  item.map((item) => {
    if (item.id === id) {
      const { children, ...newItem } = item;
      finalResult.push(newItem); //
      if (children && children.length > 0) {
        const resultChildren = childrenRecusion(children, level);
        finalResult = [...finalResult, ...resultChildren];
      }
    }
  });
  console.log('finalResult', finalResult);
  return finalResult;
}

function childrenRecusion(childrenArray, level, result = []) {
  const resultChildren = childrenArray.map((child) => {
    const { children, ...newChild } = child;
    const confidence = newChild.connectionInfo.confidence;
    if (confidence > level || confidence === level) {
      result.push(newChild);
    }
    if (children && children.length > 0) {
      console.log('else');
      console.log('newChild', newChild);
      childrenRecusion(children, level, result);
    }
  });
  //console.log('result', result);
  return result;
}
function filterByConfidence(json, level) {
  let results = [];
  function helper(obj) {
    if (obj.connectionInfo && obj.connectionInfo.confidence >= level) {
      results.push(obj);
    }
    if (obj.children) {
      obj.children.forEach(helper);
    }
  }
  json.forEach(helper);
  return results;
}
