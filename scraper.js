/* jshint esversion: 6 */
// ====================   Required dependencies
// file system dependency
const fs = require('fs');
// third party content scraper tool
const scrapeIt = require("scrape-it")
// transpiler to convert json data to a csv file
const J2cParcer = require('json2csv').Parser;
// my way around the async problem
const events = require('events');
const emitter = new events.EventEmitter();

// ==================== Configuration and global variables
const baseURL = "http://shirts4mike.com/";
const time = new Date();
const fields = ['Title','Price','ImageURL', 'URL', 'Time'];
const j2cParcer = new J2cParcer({fields});
let csv=[];


// ==================== Error Handler
handleErrorSave = err => {
    console.error(err.message);
    msg = `[${time}] ${err} \r\n`;
    if (fs.existsSync("scraper-error.log")) {
        fs.appendFileSync("scraper-error.log", msg, err => {
            if (err) {
                console.error("Unable to save the error log");
            }
        });
    } else {
        fs.writeFile("scraper-error.log", msg, err => {
            if (err) {
                console.error("Unable to save the error log");
            }
        });
    }
}

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
.catch( err => {
    throw new Error(`Cannot connect to ${baseURL + "shirts.php"}`);
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
            handleErrorSave(new Error(`There was a problem creating the "data" directory`));
        })
    })
})
.then( () => {
// ==================== Prepare the directory for incoming files
    // Create a 'data' folder if none exists
    if (!fs.existsSync("data/")) {
        fs.mkdir("data/", (err) => {
            if (err) handleErrorSave(new Error("Problem creating directory"));
            console.log("succesfully created data folder");
        });
    } else {
        console.log(`"data" folder already exists, leaving intact`);
    }
}).then( () => {
// ==================== Create an event handler for when last item is pushed to array
    emitter.on("complete", () => {
        try {
            let dateString = `${time.getFullYear()}-${
                                (time.getMonth() < 9) ? "0" + (time.getMonth() + 1): time.getMonth() +1
                                }-${
                                (time.getDate() < 9) ? "0" + (time.getDate()): time.getDate()
                                } `;

            // ==================== Convert Data to json
            let result = j2cParcer.parse(csv);
            fs.writeFile(`data/${dateString}.csv`, result, err => {
                if (err) {
                    handleErrorSave(new Error("Cannot save to file, file may be open in another Application"));
                } else {
                    console.log("File saved!");
                }
            });
        } catch (err) {
            console.log(err);
            handleErrorSave(new Error("There was a problem converting the data to JSON"));

        }

    });
})

// =================== Catch any missed errors
.catch( err => {
    handleErrorSave(err);
})
