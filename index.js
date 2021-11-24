// const csv = require('csv-parser');
const csv = require('csvtojson');
const fs = require('fs');

// const results = [];

const dateBuilder = (date) => date
  .split('/')
  .reverse()
  .map((item) => (item.length <= 1 ? `0${item}` : item))
  .join('-');

const dataNormalizer = (item) => {
  const {
    first_name, last_name, cc, amount, date
  } = item;

  const a = {
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
return a;
};

const readStream = fs.createReadStream('./input_data/users2.csv');
const writeStream = fs.createWriteStream('./output_data/users.json');

readStream.pipe(csv({ delimiter: '||', toArrayString: true, downstreamFormat: 'array' }))
  .on('data', (chunk) => {
    if (chunk.length <= 2) {
      writeStream.write(chunk);
      return;
    }

    chunk = chunk.toString();
    chunk = chunk.slice(0, chunk.length - 2);
    chunk = JSON.parse(chunk);
    console.log(chunk);
    const a = dataNormalizer(chunk);

    console.log(a)
    writeStream.write(`${JSON.stringify(a)},`);
  })
  .on('end', () => {
    console.log('Finish');
  }).then(() => {});

// readStream.pipe(writeStream);
