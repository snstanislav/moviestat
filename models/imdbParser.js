/**
* 31.01.2024 created
* 07.03.2024 adapted
* 08.03.2024 extended
*/
const cheerio = require('cheerio');
const MovieEntry = require('./movieItem.js').MovieEntry;

module.exports.parseFilm =
  (data, imdbId, imdbLink, pRating, pDateTime) => {
    const movieEntry = new MovieEntry();
    const $ = cheerio.load(data);

    let commTitle = $(`h1[data-testid="hero__pageTitle"] > span.hero__primary-text`).text();
    let origTitle =
      $(`h1[data-testid=hero__pageTitle] + div:Contains("Original title:")`).text().trim();

    origTitle = origTitle.substring(origTitle.indexOf(": ") + 2)

    let year = $(`ul li > a[href*="releaseinfo?ref_=tt_ov_rdat"]`).text();

    let duration = $(`h1[data-testid] ~ ul li:last`).text();

    //let parental = $(`ul li > a[href*="parentalguide/certificates?ref_=tt_ov_pg"]`).text();
    let parental = $(`a[href*="parentalguide/?ref_=tt_ov_pg#certificates"]`).text();

    let tryType = $(`h1[data-testid=hero__pageTitle] ~ ul >
    li:first-child`).text();

    let type =
      tryType.toLowerCase().includes("tv") ||
        tryType.toLowerCase().includes("series") ||
        tryType.toLowerCase().includes("mini") ? tryType : "";

    let countriesOrig = Array.from($(`li[data-testid="title-details-origin"] div ul li`));
    countriesOrig.forEach((item, i, self) => self[i] = $(item).text());

    if (countriesOrig.includes("Ukraine") && origTitle == "") {
      origTitle = $(`li[data-testid="title-details-akas"] div ul li`).text();
    }

    let plot = $($(`p[data-testid="plot"] > span`)[0]).text();
    plot = plot.includes("Read all") ? plot.substring(0, plot.indexOf("Read all")) : plot;
    plot = plot.replace(' "', ' «')
      .replace('" ', '» ');

    //let imdbRating = $(`a[href*="ratings/?ref_=tt_ov_rt"] div[data-testid="hero-rating-bar__aggregate-rating__score"] > span`).text();
    let imdbRating = $(`div[data-testid="hero-rating-bar__aggregate-rating__score"] span`).text();
    imdbRating = imdbRating.substring(0, imdbRating.indexOf("/"))

    //let imdbRatingNum = $($(`a[href*="ratings/?ref_=tt_ov_rt"] > span > div div div:last-child`)[0]).text().trim();
    let imdbRatingNum = $($(`div[data-testid="hero-rating-bar__aggregate-rating__score"]`)).parent().children('div').last().text();

    let sPoster = $(`div[data-testid="hero-media__poster"] img`).attr("src");

    //let genres = Array.from($(`div[data-testid="genres"] a span`));
    let genres = Array.from($(`div li a[href*="?genres="]`));
    genres.forEach((item, i, self) => self[i] = $(item).text());

    //let director = Array.from($(`p[data-testid="plot"] + div > div > ul > li[data-testid="title-pc-principal-credit"] span:Contains("Director") + div > ul > li a`));
    let director = Array.from($(`div > ul > li > div > ul > li[role="presentation"] > a[href*="/name/nm"]`));

    director.forEach((item, i, self) => {
      self[i] = {
        name: $(item).text(),
        imdbLink: "https://imdb.com" + $(item).attr("href").substring(0, $(item).attr("href").indexOf("?"))
      };
    });

    let cast = Array.from($(`div[data-testid="title-cast-item"]`));
    cast.forEach((item, i, self) => {
      personAnchor = $(item).find(`a[data-testid="title-cast-item__actor"]`);
      self[i] = {
        name: $(personAnchor).text(),
        imdbLink: "https://imdb.com" +
          $(personAnchor).attr("href").substring(0,
            $(personAnchor).attr("href").indexOf("?")),
        character: $(item).find(`a[data-testid="cast-item-characters-link"]`).text(),
        sPhoto: $(item).find("img").attr("src") != undefined ?
          $(item).find("img").attr("src") : ""
      }
    });

    let budget = $(`li[data-testid="title-boxoffice-budget"] div ul li`).text();

    let grossWW = $(`li[data-testid="title-boxoffice-cumulativeworldwidegross"]
    div ul li`).text();

    movieEntry.imdbId = imdbId;
    movieEntry.imdbLink = imdbLink;
    movieEntry.commTitle = commTitle;
    movieEntry.origTitle = origTitle;
    movieEntry.year = year;
    movieEntry.duration = duration;
    movieEntry.parental = parental;
    movieEntry.type = type;
    movieEntry.countriesOrig = countriesOrig;
    movieEntry.plot = plot;
    movieEntry.imdbRating = imdbRating;
    movieEntry.imdbRatingNum = imdbRatingNum;
    movieEntry.sPoster = sPoster;
    movieEntry.genres = genres;
    movieEntry.director = director;
    movieEntry.cast = cast;
    movieEntry.budget = budget;
    movieEntry.grossWW = grossWW;
    movieEntry.pRating = pRating;
    movieEntry.pDateTime = pDateTime;
    movieEntry.favorite = false;

    return movieEntry;
  }
///
module.exports.parseSearchResult = (searchResultList, data) => {
  const $ = cheerio.load(data);
  $('li.find-title-result').each((i, elem) => {
    const srcSet = $(elem).find('div div img').attr('srcset');
    let bestPic = "";
    if (srcSet) {
      picArr = srcSet.split(', ')
      bestPic = picArr[picArr.length - 1];
    } else {
      bestPic = $(elem).find('div div img').attr('src');
    }

    searchResultList.push({
      ind: i + 1,
      poster: bestPic,
      title: $(elem).find('a').text(),
      link: prepareImbdLink($(elem).find('a').attr('href')),
      year: $(elem).find('a + ul > li:first').text(),
      shortcast: $(elem).find('a ~ ul:last > li').text()
    });
  });
}

function prepareImbdLink(link) {
  return "https://imdb.com" + link.substring(0,
    link.indexOf("?"));
}