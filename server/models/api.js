const axios = require("axios");
const endpoints = require('./endpoints');

const url = (model, ix) => `${process.env.API_END_POINT}${endpoints[model.toLowerCase()]}` + (ix ? `/${ix}` : '');
const get = async(model, ix) => {
    try {
        const result = await axios.get(url(model, ix));
        return result;
    }
    catch (err) {
        console.log(url(model));
        console.log(err);
    }
}

const post = async (model, data) => {
    try {
        const result = await axios.post(url(model), data);
        console.log(result);
        return result;
    }
    catch (err) {
        console.log(url(model));
        console.log(err);
    }
}

module.exports = { get, post }
