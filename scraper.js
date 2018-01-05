/* jshint esversion: 6 */
// ====================   Required dependencies
// file system dependency
const fs = require('fs');
// third party content scraper tool
const scrapeIt = require("scrape-it")
// transpiler to convert json data to a csv file
const j2c = require('json2csv');

// ==================== Configuration and global variables
const baseURL = "http://shirts4mike.com/";




// ==================== Scrape the website
 
// scrape main page for shirt urls
scrapeIt(baseURL + "shirts.php", {
    // Fetch the links to individual pages
    pages: {
        listItem: ".products li",
        name: "pages",
        data: {
            url: {
                selector: "a",
                attr: "href"
            }
        }
    }
})
.then(data => {
    // data
    data.pages.forEach(page => {
        console.log(page.url);
    });


}, err => {
    console.error(`There was a problem reaching ${entryURL}`);
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
    console.log(`"data" folder already exists, leaving intact`);
}





// ==================== Error handling




