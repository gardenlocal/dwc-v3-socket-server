const axios = require("axios");
const config = require("./config");

const cache = require("./cache.service");

function convertDwcToWorkers(creature) {
  if (!creature) {
    return null;
  }

  return {
    ...creature,
    animated_properties: creature.animatedProperties,
    animatedProperties: undefined,
  };
}

function convertWorkersToDwc(creature) {
  if (!creature) {
    return null;
  }

  return {
    ...creature,
    animatedProperties: creature.animated_properties,
    animated_properties: undefined,
  };
}

exports.save = async function (creature) {
  cache.resetAllCreatures();

  const result = await axios({
    method: "post",
    url: `${config.apiHost}/creatures`,
    data: convertDwcToWorkers(creature),
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  return convertWorkersToDwc(result.data.row);
};

exports.find = async function (where) {
  const cachedCreatures = cache.findAllCreatures();
  if (cachedCreatures) {
    return cachedCreatures;
  }

  const result = await axios({
    method: "get",
    url: `${config.apiHost}/creatures/all`,
    params: where,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  const creatures = result.data.rows.map(convertWorkersToDwc);
  cache.setAllCreatures(creatures);
  return creatures;
};

exports.findOne = async function (where) {
  const result = await axios({
    method: "get",
    url: `${config.apiHost}/creatures/all`,
    params: where,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  if (result.data && result.data.rows && result.data.rows.length) {
    return convertWorkersToDwc(result.data.rows[0]);
  }

  return null;
};

exports.findOneByUid = async function (where) {
  const result = await axios({
    method: "get",
    url: `${config.apiHost}/creatures/all`,
    params: where,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  if (result.data && result.data.rows && result.data.rows.length) {
    return convertWorkersToDwc(result.data.rows[0]);
  }

  return null;
};

exports.findById = async function (id) {
  const result = await axios({
    method: "get",
    url: `${config.apiHost}/creatures/${id}`,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  return convertWorkersToDwc(result.data.row);
};

exports.update = async function (id, data) {
  cache.resetAllCreatures();

  data.user = undefined;
  data.owner = undefined;

  const result = await axios({
    method: "put",
    url: `${config.apiHost}/creatures/${id}`,
    data: data ? convertDwcToWorkers(data) : data,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  if (result.data.rows) {
    return convertWorkersToDwc(result.data.rows[0]);
  }

  return null;
};
