const axios = require("axios").default;

const getAllCityData = async () => {
  try {
    let result = [];
    const getProvinces = await axios.get(
      "http://dev.farizdotid.com/api/daerahindonesia/provinsi"
    );
    const provinces = getProvinces.data["provinsi"];
    console.log(provinces);
    for (const province of provinces) {
      const getCities = await axios.get(
        `http://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${province.id}`
      );
      const cities = getCities.data["kota_kabupaten"];
      result.push(...cities);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = getAllCityData;
