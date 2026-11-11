const DEFAULTS = Object.freeze({
  cinema_id: '',
});

export function normalizeConfig(input = {}) {
  return {
    cinema_id: String(input.cinema_id ?? DEFAULTS.cinema_id)
      .trim()
      .toUpperCase(),
  };
}

export function validateConfig(config) {
  if (!config.cinema_id) {
    throw new Error('Run the "Find my cinema" action and set a cinema ID.');
  }

  // AlloCiné theater internalIds are 5-character codes that always start with a
  // LETTER followed by four alphanumerics: most are a letter then four digits
  // (e.g. P0905), but some carry letters in other positions too — Vichy is
  // G028P, Lyon's Ciné Théâtre Marcel Pagnol is G0FQ8 (verified across ~140
  // theaters, first character always a letter, never a digit). Requiring the
  // leading letter rejects an id copied from the wrong place — e.g. an old
  // AlloCiné "csalle" reference like 5914Z — at config time with a clear
  // message, instead of letting the integration report "connected" and then
  // fail every showtimes fetch with a 404.
  if (!/^[A-Z][A-Z0-9]{4}$/.test(config.cinema_id)) {
    throw new Error('Cinema ID must look like P0905 or G028P (see the "Find my cinema" action).');
  }
}
