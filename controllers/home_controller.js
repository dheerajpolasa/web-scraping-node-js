const rp = require("request-promise");
const cheerio = require("cheerio");

// to the query string which is used to send request to medium
const getIgnoreString = (array) => {
  return array.reduce(function (acc, ele) {
    return acc + "&ignore=" + ele;
  }, "");
};

// Render the home page
module.exports.home = function (req, res) {
  try {
    console.log("Home controller");
    return res.render("home");
  } catch (err) {}
};

// Handle the search section
module.exports.search = function (req, res) {
  try {
    // console.log(req.body);
    console.log(req.body.search);
    const ignoreString = getIgnoreString(req.body.ignore);
    console.log(ignoreString);
    const url = `https://www.medium.com/search/posts?q=${req.body.search}&count=10${ignoreString}`;
    console.log(url);

    const options = {
      url: url,
    };

    rp(options)
      .then((data) => {
        // console.log('Posts ', data)
        const $ = cheerio.load(data);

        console.log($(".postArticle-content > a").length);
        let results = [];

        $(".postArticle").each(function (index) {
          const userSection = $(this).find(
            'div[class="u-clearfix u-marginBottom15 u-paddingTop5"] > div > div'
          );
          const postArticleContent = $(this).find(
            'div[class="postArticle-content"] > a'
          );
          const sectionContent = $(this).find(
            'section > div[class="section-content"] > div'
          );
          let result = {
            url: $(postArticleContent).attr("href"),
            postId: $(postArticleContent).attr("data-post-id"),
            heading: $(sectionContent).find("h3").text(),
            image: $(sectionContent)
              .find("figure > div")
              .find("img")
              .attr("src"),
            username: $(userSection)
              .find("div:nth-child(2) > a:nth-child(1)")
              .text(),
            blog: $(userSection)
              .find("div:nth-child(2) > a:nth-child(2)")
              .text(),
          };
          console.log(result);
          //   res.send(result);
          results.push(result);
        });

        // res.end();

        if (req.xhr) {
          return res.json(201, {
            data: results,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.json(500, {
          message: "Failure",
        });
      });
  } catch (err) {
    return res.redirect("back");
  }
};

// Handle the article page
module.exports.post = function (req, res) {
  try {
    console.log(req.query.link);
    const url = req.query.link;
    const options = {
      url: url,
    };

    rp(options)
      .then((data) => {
        const $ = cheerio.load(data);
        const article = $("article");
        const heading = $(article)
          .find("div > section")
          .find("h1")
          .first()
          .text();
        console.log(heading);
        const subHeading = $(article)
          .find("div > section")
          .find("h2")
          .first()
          .text();
        const userAvatar = $(article)
          .find("div > section > div > div > div")
          .find("img")
          .attr("src");
        console.log(userAvatar);
        const user = req.query.username;
        console.log(user);

        const figure = $(article)
          .find("div > section > div > div > figure")
          .find("img")
          .attr("src");
        console.log(figure);

        return res.render("article", {
          heading: heading,
          subHeading: subHeading,
          userAvatar: userAvatar,
          user: user,
          figure: figure,
        });
      })
      .catch((err) => console.error(err));
  } catch (err) {
    return res.redirect("back");
  }
};
