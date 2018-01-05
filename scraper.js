/* jshint esversion: 6 */
// ====================   Required dependencies
// file system dependency
const fs = require('fs');
// third party content scraper tool
const scrapeIt = require("scrape-it")
// transpiler to convert json data to a csv file
const j2c = require('json2csv');
// my way around the async problem
const events = require('events');
const emitter = new events.EventEmitter();

// ==================== Configuration and global variables
const baseURL = "http://shirts4mike.com/";
const time = new Date();
let csv=[];

// ==================== Scrape main site for shirt urls
scrapeIt(baseURL + "shirts.php", {
    // Fetch the links to individual pages
    pages: {
        listItem: ".products li",
        name: "pages",
        data: {
            url: {
                selector: "a",
                attr: "href",
            }
        }
    }
})
// ==================== Get shirt data
// cycle through each scraped url and fetch data for each shirt
.then(data => {
    if(!data) throw new Error(`No urls recovered, please check your internet connection or ${baseURL} may be down`);
    data.pages.forEach(page => {
       scrapeIt(baseURL + page.url, { 
            Title: {
                selector: "img",
                attr    : "alt"
            },
            Price: ".price",
            ImageURL: { 
                selector: "img",
                attr    : "src"
            }
        }).then(shirt => {
            shirt.URL    = baseURL + page.url;
            shirt.Time   = new Date();
           
            csv.push(shirt);
            if (csv.length === data.pages.length) {
                emitter.emit("complete");
            }
        }).catch( err => {
            console.error(err.message);
        })
    })
})
.then( () => {
// ==================== Prepare the directory for incoming files
    // Create a 'data' folder if none exists
    if (!fs.existsSync("data/")) {
        fs.mkdir("data/", (err) => {
            if (err) throw new Error("Problem creating directory");
            console.log("succesfully created data folder");
        });
    } else {
        console.log(`"data" folder already exists, leaving intact`);
    }
}).then( () => {
// ==================== Create an event handler for when last item is pushed to array
    emitter.on("complete", () => {



    });
})

// =================== Handle errors

.catch( err => {
    console.error(err.message);
})

// ==================== Convert Data stream to json












