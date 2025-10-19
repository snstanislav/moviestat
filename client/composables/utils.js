export function prettyMediaType(rawMediaType) {
    var result = "";
    switch (rawMediaType) {
        case "movie":
            result = "Movie";
            break;
        case "tv":
            result = "TV Series";
            break;
        default:
            result = "";
            break;
    }
    return result;
}

export function defaultSortRecentDate(db) {
  if (db) {
    return db.sort((a, b) => {
      let argA = a.userChangeEvalDate ? a.userChangeEvalDate : a.userEvalDate;
      let argB = b.userChangeEvalDate ? b.userChangeEvalDate : b.userEvalDate;
      return new Date(argB) - new Date(argA);
    });
  }
}

export function normalizeYear(yearStr) {
  const result = Number(yearStr.substring(0, 4));
  return result ? result : 0;
}

export function normalizeIMDBVotes(str) {
  return str ? Number(str.replaceAll(",", "")) : 0;
}