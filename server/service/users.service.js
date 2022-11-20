const { convertWorkersToDwc } = require("./gardens.service");
const { client: supabase, NOT_FOUND_ERROR_CODE } = require("./supabase.service");
const gardenSectionsService = require("./gardens.service");

const SELECT =
  "id, uid, creatureName, role: role_id (id, name), creature: creature_id (*), gardenSection: garden_section_id (*)";

exports.create = async function (user) {
  const { data, error } = await supabase.from("users").insert(user).select(SELECT).single();

  if (error) {
    console.error(error);
    return null;
  }

  const newUser = data;
  if (newUser.gardenSection) {
    newUser.gardenSection = convertWorkersToDwc(row.gardenSection);
  }

  return newUser;
};

exports.find = async function ({ where }) {
  const query = await supabase.from("users").select(SELECT);

  if (where) {
    Object.keys(where).forEach((key) => {
      query.eq(key, where[key]);
    });
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  if (data) {
    return data.map((row) => {
      if (row.gardenSection) {
        row.gardenSection = convertWorkersToDwc(row.gardenSection);
      }

      return row;
    });
  }

  return [];
};

exports.findById = async function (id) {
  const { data, error } = await supabase.from("users").select(SELECT).eq("id", id).limit(1).single();

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw error;
  }

  if (data && data.gardenSection) {
    data.gardenSection = convertWorkersToDwc(data.gardenSection);
  }

  return data;
};

exports.findByUid = async function (uid) {
  const { data, error } = await supabase.from("users").select(SELECT).eq("uid", uid).limit(1).single();

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw error;
  }

  if (data && data.gardenSection) {
    data.gardenSection = convertWorkersToDwc(data.gardenSection);
  }

  return data || null;
};

exports.findOne = async function ({ where }) {
  const query = supabase.from("users").select(SELECT);

  if (where) {
    Object.keys(where).forEach((key) => {
      query.eq(key, where[key]);
    });
  }

  const { data, error } = await query.limit(1).single();

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw error;
  }

  if (data && data.gardenSection) {
    data.gardenSection = convertWorkersToDwc(data.gardenSection);
  }

  return null;
};

exports.update = async function (id, user) {
  user.gardenSection = undefined;
  user.role = undefined;
  user.creature = undefined;

  const { data, error } = await supabase.from("users").update(user).eq("id", id).select(SELECT);

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw new Error(result.data.error);
  }

  const updatedUser = data && data[0];

  if (updatedUser && updatedUser.gardenSection) {
    updatedUser.gardenSection = convertWorkersToDwc(updatedUser.gardenSection);
  }

  return updatedUser;
};

exports.assignGarden = async function (id, { x, y } = {}) {
  let _garden = null;
  if (`${x}` && `${y}`) {
    _garden = await gardenSectionsService.findOne({ where: { x, y } });

    if (!_garden) {
      throw createHttpError(httpStatus.BAD_REQUEST, "해당 위치의 가든이 존재하지 않습니다.");
    }

    const _user = await exports.findOne({ garden_section_id: _garden.id });
    if (_user && _user.id) {
      await exports.update(user.id, {
        ..._user,
        garden_section_id: null,
      });
    }

    _garden.user_id = id;

    const result = await gardenSectionsService.update(_garden.id, _garden);
  } else {
    const { data, error } = await supabase.rpc("find_highest_priority_garden_v2", { userid: id });
    if (error) {
      console.error(error);
      return null;
    }

    _garden = data[0];
  }

  user = await exports.update(id, {
    garden_section_id: _garden.id,
  });

  if (user && user.gardenSection) {
    user.gardenSection = convertWorkersToDwc(user.gardenSection);
  }

  return user;
};

exports.removeGarden = async function (id) {
  return supabase.from("users").update({ garden_section_id: null }).eq("id", id).single();
};
