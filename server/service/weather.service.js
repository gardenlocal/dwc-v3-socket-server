const { client: supabase } = require("./supabase.service");

exports.create = async (weather) => {
  const { data, error } = await supabase.from("weather").insert(weather).select().single();

  if (error) {
    throw error;
  }

  return data;
};

exports.fetchWeather = async () => {
  const { data, error } = await supabase.from("weather").select().order("timestamp", { ascending: false }).limit(1).single();
  if (error) {
    throw error;
  }
  return data;
};
