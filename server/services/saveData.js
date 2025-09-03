const fs = require("fs");
const path = require("path");

const readFile = (path, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

function writeFilePromise(filePath, data, encoding = "utf-8") {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, encoding, (err) => {
      if (err) reject(err);
      else resolve("File written successfully");
    });
  });
}

const saveData = async (dataInp, tableName) => {
  if (tableName === "users") {
    let jsonData = [];
    let filePath = path.join(__dirname, "..", "models", "users.json");
    try {
      const readFileData = await readFile(filePath, "utf-8")
        .then((res) => {
          jsonData = JSON.parse(res);
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
      if (!readFileData) {
        console.log("unable to read file data!");

        return false;
      }
      jsonData.push(dataInp);

      const writtenData = await writeFilePromise(
        filePath,
        JSON.stringify(jsonData),
        "utf-8"
      )
        .then((res) => {
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
      return writtenData;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};

module.exports = {
  saveData: saveData,
  readFile: readFile,
  writeFilePromise: writeFilePromise,
};
