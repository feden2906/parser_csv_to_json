// const csv = require('csv-parser');
const csv = require('csvtojson');
const fs = require('fs');

const dateBuilder = (date) => date
  .split('/')
  .reverse()
  .map((item) => (item.length <= 1 ? `0${item}` : item))
  .join('-');

const dataNormalizer = (item) => {
  const {
    first_name, last_name, cc, amount, date
  } = item;

  return {
    name: `${last_name} ${first_name}`,
    phone: String,
    person: {
      firstName: first_name,
      lastName: last_name
    },
    amount,
    date: dateBuilder(date),
    costCenterNum: cc.slice(3)
  };
};

const readStream = fs.createReadStream('./input_data/users2.csv');
const writeStream = fs.createWriteStream('./output_data/users.json');

const csvConfig = {
  delimiter: '||',
  toArrayString: true,
  // downstreamFormat: 'array',
  colParser: {
    amount: 'number',
    date: 'Date'
  }
};
writeStream.write('[')
readStream.pipe(csv(csvConfig))
  .once('data', () => writeStream.write('['))
  .on('data', (chunk) => {
    // if (chunk.length <= 2) {
    //   writeStream.write(chunk);
    //   return;
    // }

    const data = JSON.parse(chunk.toString());

    const a = dataNormalizer(data);

    writeStream.write(`${JSON.stringify(a)},`);
  })
  .on('end', () => {
    writeStream.write(']');
    console.log('Finish');
  }).then(() => {});
