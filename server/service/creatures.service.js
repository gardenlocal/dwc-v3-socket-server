const { client: supabase, NOT_FOUND_ERROR_CODE } = require("./supabase.service");

const SELECT =
  "id, owner: user_id (*), user: user_id (id, uid, creatureName), is_online, appearance, animated_properties";

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
  const { data, error } = await supabase
    .from("creatures")
    .insert(convertDwcToWorkers(creature))
    .select(SELECT)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return convertWorkersToDwc(data);
};

exports.find = async function (where) {
  const query = supabase.from("creatures").select(SELECT);

  if (where) {
    Object.keys(where).forEach((key) => {
      query.eq(key, where[key]);
    });
  }

  const { data, error } = await query;

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    console.error(error);
    return [];
  }

  if (data) {
    return data.map((row) => convertWorkersToDwc(row));
  }

  return [];
};

exports.findOne = async function (where) {
  const query = supabase.from("creatures").select(SELECT);

  if (where) {
    Object.keys(where).forEach((key) => {
      query.eq(key, where[key]);
    });
  }

  const { data, error } = await query.limit(1).single();

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw error;
  }

  return convertWorkersToDwc(data);
};

exports.findById = async function (id) {
  const { data, error } = await supabase.from("creatures").select(SELECT).eq("id", id).limit(1).single();

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw error;
  }

  return convertWorkersToDwc(data);
};

exports.update = async function (id, creature) {
  creature.user = undefined;
  creature.owner = undefined;

  const { data, error } = await supabase
    .from("creatures")
    .update(convertDwcToWorkers(creature))
    .eq("id", id)
    .select(SELECT);

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    console.error(error);
    return null;
  }

  const updatedCreature = data && data[0];
  return convertWorkersToDwc(updatedCreature);
};
