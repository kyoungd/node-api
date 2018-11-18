const axios = require("axios");
const endpoints = require('./endpoints');

const url = (model, ix) => `${process.env.API_END_POINT}${endpoints[model.toLowerCase()]}` + (ix ? `/${ix}` : '');
const get = async(model, ix) => {
    try {
        const result = await axios.get(url(model, ix));
        return result;
    }
    catch (err) {
        console.log(url(model, ix));
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

const put = async(model, data, ix) => {
  try {
    const result = await axios.put(url(model, ix), data);
    return result;
  }
  catch (err) {
    console.log(url(model, data, ix));
    console.log(err);
  }
}

const remove = async(model, ix) => {
  try {
      const result = await axios.delete(url(model, ix));
      return result;
  }
  catch (err) {
      console.log(url(model, ix));
      console.log(err);
  }
}

const getResourceId = (rid) => rid.split('#')[1];

const makeResourceId = (model, id) => 
  id.includes("resource") ? id : "resource:" + endpoints[model].slice(1, endpoints[model].length) + "#" + id;

module.exports = { get, post, put, remove, getResourceId, makeResourceId }
