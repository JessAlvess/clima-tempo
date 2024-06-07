const fs = require("fs/promises");
const axios = require("axios");
const pool = require("./bd-postgres");
require("dotenv").config();

async function readZip(zips) {
  try {
    const { data } = await axios.get(process.env.pathZip + zips);

    const queryInsert = `
        INSERT INTO ceps (cep, cidade, bairro, estado, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON conflict do nothing
        `;

    for (const cep in data.results) {
      const cepObject = data.results[cep][0];

      const params = [
        cepObject.postal_code,
        cepObject.city_en,
        cepObject.city,
        cepObject.state_en,
        cepObject.latitude,
        cepObject.longitude,
      ];

      await pool.query(queryInsert, params);
    }
    console.log("Os ceps foram adicionados no banco de dados");
    meteorologicalData();
  } catch (error) {
    if (error) {
      console.error(error.message);
    }
  }
}

async function meteorologicalData() {
  try {
    const querySelect = `
    select * from ceps
    `;

    const selectReturn = await pool.query(querySelect);

    const queryInsert = `
        INSERT INTO clima (cep_id, temperatura, descricao)
        VALUES ($1, $2, $3)
    ON conflict (cep_id) do update set temperatura = $2, descricao = $3, data_hora = now()
        `;

    const returnWeather = async (latitude, longitude) => {
      const { data } = await axios.get(
        process.env.pathWeather +
          `lat=${latitude}&lon=${longitude}` +
          process.env.weatherKey
      );
      return data;
    };

    selectReturn.rows.forEach((object) => {
      returnWeather(object.latitude, object.longitude).then((data) => {
        const params = [object.id, data.main.temp, data.weather[0].description];

        pool.query(queryInsert, params);
      });
    });

    console.log("As informações de clima foram adicionados no banco de dados");
  } catch (error) {
    if (error) {
      console.error(error.message);
    }
  }
}

(async function () {
  const file = await fs.readFile("./src/ceps.txt", "utf8");

  const fileToArray = file.split("*");

  let zips = fileToArray
    .filter((_, index) => {
      return index % 2 !== 0;
    })
    .join(",");

  readZip(zips);
})();
