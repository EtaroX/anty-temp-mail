require("dotenv").config();

const axios = require("axios");
const _ = require("underscore");
const _Domains = require("./known-email-domains.json");
const fs = require("fs");

/*
  @param email: email address
  @param getDomains: boolean, if true, will check if domains are up to date
*/
exports.checkEmail = function (email, getDomains = false) {
  if (getDomains) 
    exports.getDomains();
  const emailDomain = email.split("@")[1];
  const _Domain = _.find(_Domains, function (domain) {
    return domain.domain === emailDomain;
  });

  if (_Domain) {
    return true;
  } else {
    return false;
  }
};
exports.getDomains = function () {
  const newDomains = [];
  if (!process.env.RAPID_API_KEY) {
    console.error("Please add your API key to the .env file");
    return;
  }
  const lastCheckTime = _Domains.lastCheckTime;
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - lastCheckTime;
  const hoursDiff = timeDiff / 1000 / 60 / 60;
  if (hoursDiff < 1) {
    console.log("Domains were checked less than 1 hour ago");
    return;
  }

  const options1 = {
    method: "GET",
    url: "https://privatix-temp-mail-v1.p.rapidapi.com/request/domains/",
    headers: {
      "X-RapidAPI-Key": `${process.env.RAPID_API_KEY}`,
      "X-RapidAPI-Host": "privatix-temp-mail-v1.p.rapidapi.com",
    },
  };

  const options2 = {
    method: "GET",
    url: "https://api.internal.temp-mail.io/api/v4/domains",
  };

  Promise.all([
    axios.request(options1),
    axios.request(options2)
  ])
    .then(function (responses) {
      const domains1 = responses[0].data;
      const domains2 = responses[1].data.domains;
      const _DomainsArray = _Domains.domains.map((domain) => domain.domain);

      domains1.forEach((domain) => {
        if (!_DomainsArray.includes(domain)) {
          newDomains.push(domain);
        }
      });

      domains2.forEach((domain) => {
        if (!_DomainsArray.includes(domain.name)) {
          newDomains.push(domain.name);
        }
      });


      if (newDomains.length > 0) {
        const newDomainsArray = [..._Domains.domains, ...newDomains];
        fs.writeFile(
          "./known-email-domains.json",
          JSON.stringify({ lastCheckTime: new Date().getTime(), domains: newDomainsArray }),
          function (err) {
            if (err) {
              throw err;
            }
            console.log("Domains updated");
          }
        );
        return newDomainsArray;
      }
    })
    .catch(function (error) {
      throw error;
    });
};
/*
  @param domains: array of domains
*/
exports.addDomains = function (domains) {
  const newDomainsArray = [..._Domains.domains, ...domains];
  fs.writeFile(
    "./known-email-domains.json",
    JSON.stringify({ lastCheckTime: new Date().getTime(), domains: newDomainsArray }),
    function (err) {
      if (err) {
        throw err;
      }
      console.log("Domains updated");
    }
  );
  return newDomainsArray;
}
