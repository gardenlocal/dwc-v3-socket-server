const { client: supabase, NOT_FOUND_ERROR_CODE } = require("./supabase.service");

const SELECT = "id, user_id, owner: user_id (*), user: user_id (*), x, y, index, props";

function convertDwcToWorkers(garden) {
  return {
    ...garden,
    tileProps: undefined,
    shaderProps: undefined,
    props: {
      tiles: garden.tileProps,
      shader: garden.shaderProps,
    },
  };
}

function convertWorkersToDwc(garden) {
  if (!garden) {
    return garden;
  }

  return {
    ...garden,
    tileProps: garden.props.tiles,
    shaderProps: garden.props.shader,
  };
}

exports.save = async function (garden) {
  const { data, error } = await supabase
    .from("gardensections")
    .insert(convertDwcToWorkers(garden))
    .select(SELECT)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return convertWorkersToDwc(data);
};

exports.find = async function (where) {
  const query = await supabase.from("gardensections").select(SELECT);

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
    return data.map((row) => convertWorkersToDwc(row));
  }

  return [];
};

exports.findTheMostEdge = async function () {
  const { data, error } = await supabase.rpc("find_the_most_edge_garden");

  if (error) {
    console.error(error);
    return null;
  }

  console.log("---> the most edge");
  console.log(data);
  const mostEdge = data && data[0];
  if (mostEdge) {
    return convertWorkersToDwc(mostEdge);
  }

  return null;
};

exports.findById = async function (id) {
  const { data, error } = await supabase.from("gardensections").select(SELECT).eq("id", id).limit(1).single();

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    throw error;
  }

  return convertWorkersToDwc(data);
};

exports.findOne = async function ({ where }) {
  const query = supabase.from("gardensections").select(SELECT);

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

exports.update = async function (id, garden) {
  garden.user = undefined;
  garden.owner = undefined;

  const { data, error } = await supabase
    .from("gardensections")
    .update(convertDwcToWorkers(garden))
    .eq("id", id)
    .select(SELECT);

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    console.error(error);
    return null;
  }

  const updatedGarden = data && data[0];
  return convertWorkersToDwc(updatedGarden);
};

exports.updateWithoutConvert = async function (id, garden) {
  garden.user = undefined;
  garden.owner = undefined;

  const { data, error } = await supabase.from("gardensections").update(garden).eq("id", id).select(SELECT);

  if (error && error.code !== NOT_FOUND_ERROR_CODE) {
    console.error(error);
    return null;
  }

  const updatedGarden = data && data[0];
  return convertWorkersToDwc(updatedGarden);
};

exports.remove = function (id) {
  return supabase.from("gardensections").delete().eq("id", id);
};

exports.convertWorkersToDwc = convertWorkersToDwc;
