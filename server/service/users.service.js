const axios = require("axios");
const config = require("./config");
const { convertWorkersToDwc } = require("./gardens.service");
const cache = require("./cache.service");

exports.create = async function (user) {
  const result = await axios({
    method: "post",
    url: `${config.apiHost}/users`,
    data: user,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  const { row } = result.data;
  if (row.gardenSection) {
    row.gardenSection = convertWorkersToDwc(row.gardenSection);
  }

  cache.setUserByUid(row);
  return row;
};

exports.find = async function ({ where }) {
  const result = await axios({
    method: "get",
    url: `${config.apiHost}/users/all`,
    params: where,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  if (result.data && result.data.rows) {
    return result.data.rows.map((row) => {
      if (row.gardenSection) {
        row.gardenSection = convertWorkersToDwc(row.gardenSection);
      }

      return row;
    });
  }

  return [];
};

exports.findById = async function (id) {
  const result = await axios({
    method: "get",
    url: `${config.apiHost}/users/${id}`,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  const { row } = result.data;
  if (row && row.gardenSection) {
    row.gardenSection = convertWorkersToDwc(row.gardenSection);
  }

  return row;
};

exports.findByUid = async function (uid) {
  const user = cache.getUserByUid(uid);
  if (user) {
    return user;
  }

  const result = await axios({
    method: "get",
    url: `${config.apiHost}/users/by-uid/${uid}`,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  const { row } = result.data;
  if (row && row.gardenSection) {
    row.gardenSection = convertWorkersToDwc(row.gardenSection);
  }

  cache.setUserByUid(row);
  return row;
};

exports.findOne = async function ({ where }) {
  const result = await axios({
    method: "get",
    url: `${config.apiHost}/users/all`,
    params: where,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  if (result.data && result.data.rows && result.data.rows.length) {
    const row = result.data.rows[0];
    if (row.gardenSection) {
      row.gardenSection = convertWorkersToDwc(row.gardenSection);
    }

    return row;
  }

  return null;
};

exports.update = async function (id, data) {
  data.gardenSection = undefined;
  data.role = undefined;
  data.creature = undefined;

  const result = await axios({
    method: "put",
    url: `${config.apiHost}/users/${id}`,
    data,
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  if (result.data && result.data.rows && result.data.rows.length) {
    const row = result.data.rows[0];
    if (row.gardenSection) {
      row.gardenSection = convertWorkersToDwc(row.gardenSection);
    }

    cache.setUserByUid(row);
    return row;
  }
};

exports.assignGarden = async function (id, { x, y } = {}) {
  cache.resetTheMostEdgeGarden();

  const result = await axios({
    method: "put",
    url: `${config.apiHost}/users/${id}/garden-sections`,
    data: { x, y },
  });

  if (result.data.error) {
    throw new Error(result.data.error);
  }

  const { row } = result.data;
  if (row && row.gardenSection) {
    row.gardenSection = convertWorkersToDwc(row.gardenSection);
  }

  cache.setUserByUid(row);
  return row;
};

exports.removeGarden = async function (id, uid) {
  cache.resetUserByUid(uid);
  return exports.update(id, { garden_section_id: null });
};
