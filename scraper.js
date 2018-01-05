/* jshint esversion: 6 */
// ====================   Required dependencies
// file system dependency
const fs = require('fs');
// third party content scraper tool
const scrapeIt = require("scrape-it")
// transpiler to convert json data to a csv file
const j2c = require('json2csv');

// ==================== Configuration and global variables
const entryURL = "http://shirts4mike.com/shirts.php";




// ==================== Scrape the website
 
// Promise interface
// scrapeIt("https://ionicabizau.net", {
//     title: ".header h1"
//   , desc: ".header h2"
//   , avatar: {
//         selector: ".header img"
//       , attr: "src"
//     }
// }).then(page => {
//     console.log(page)
// })
 
// Callback interface
scrapeIt(entryURL, {
    // Fetch the links to individual pages
    pages: {
        listItem: ".products li",
      name: "pages",
      data: {
            url: {
                selector: "a"
              , attr: "href"
            }
        }
    }
}, (err, page) => {
    console.log(err || page)
})



// ==================== Convert Data stream to json

// ==================== Prepare the directory for incoming files
// Create a 'data' folder if none exists
if (!fs.existsSync("data/")) {
    fs.mkdir("data/", (err) => {
        if (err) throw err;
        console.log("succesfully created data folder");
    });
} else {
    console.log("'data' folder already exists, leaving intact");
}





// ==================== Error handling




