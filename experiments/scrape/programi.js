import axios from "axios";
import fs from "fs";

/**
 * Payload for scrapping postani-student.hr
 * @type {Object}
 * @property {string} Mjesto
 * @property {Array} lista
 * @property {number} page
 * @property {string} podrucje
 * @property {string} polje
 * @property {string} posebnaKvota
 * @property {string} search
 * @property {string} searchVisokaUcilista
 * @property {Boolean} usporedba
 */ 
let payload = {
    Mjesto: "Sva mjesta",
    lista: [],
    page: 1,
    podrucje: "-1",
    polje: "-1",
    posebnaKvota: "-1",
    search: "",
    searchVisokaUcilista: "",
    usporedba: true
}

// ===========================================================================================
// First let us scrape the HTML code, from where I can read all the possible values for lista
//============================================================================================

// the url
const url = "https://www.postani-student.hr/Ucilista/Nositelji.aspx";

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.postani-student.hr/Ucilista/Nositelji.aspx',
    'Origin': 'https://www.postani-student.hr',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

const _options = fs.readFileSync("./_options.html", 'utf8');

scraper();

async function scraper() {
    axios.get(url)
    .then(response => {
        let html_src_code = response.data;   // string
        let temp = html_src_code;   // so that I can do destructive things to it

        // fs.writeFileSync(output_file_path, html_src_code);

        // now that I have the source code (HTML), I have to extract what I need
        // from it. And I need all the options to the select elements, so that I
        // can generate my own options. Beyond that, I especially need the id's of
        // sastavnica, so that I may fill out the payloads lista.

        // All of the options, are contained in select elements, so I can extract all
        // select elements and everything within them.

        const opening_tag = "<select";
        const closing_tag = "</select>";

        let options = {
            vrsta_nositelja: "",
            ucilista: "",
            sastavnice: "",
            posebna_kvota: "",
            mjesto: "",
            podrucje: "",
            polje: ""
        }

        let start = 0;
        let end = 0;
        for (let option in options) {
            start = temp.search(opening_tag);
            end = temp.search(closing_tag) + closing_tag.length;

            options[option] = temp.substring(start, end);

            temp = temp.replace(options[option], "<!-- Extracted -->");
            
            fs.appendFileSync("./options.html", options[option])
        }

        // compare_options();

        // ==== Sastavnice ==== //

        temp = options["sastavnice"];

        // clean sastavnice (remove select element wrapper)
        start = temp.search(opening_tag);
        end = temp.search(">");

        let substring = temp.substring(start, end + 1);
        temp = temp.replace(substring, "");
        temp = temp.replace(closing_tag, "");

        options["sastavnice"] = temp;

        temp = options["sastavnice"];
        // extract sastavnica indexes
        let index_num = options["sastavnice"].match(new RegExp("<option", "g")).length;
        let indexes = [];
        let option = "";
        for (let i=0; i < index_num; i++) {
            start = temp.search("<option");
            end = temp.search("</option>");

            option = temp.substring(start, end + ("</option>").length);

            temp = temp.replace(option, "");

            start = option.search('value="');
            end = option.search('">');

            option = option.substring(start + ('value="').length, end);

            indexes[i] = option;
        }

        payload.lista = indexes;

        const apiUrl = "https://www.postani-student.hr/webservices/Pretraga.svc/PretraziPrograme";
        const proxy = 'https://corsproxy.io/?url='; // node doesn't need proxy, I guess?
        
        first_post(apiUrl);
    });
}

async function first_post(apiUrl) {
    axios.post(apiUrl, payload, {
            headers: headers
        })
        .then(async (response) => {
            console.log("Success! Response received.");
            console.log("Number of programs:", response.data.d?.Programi?.length || 0);
            console.log("Total pages:", response.data.d?.TotalPages || 0);

            let data = response.data.d;
            let total_pages = data.TotalPages;

            let programi = [];
            for (let i = 1; i <= total_pages; i++) {
                if (i > 1) {
                    console.log(`Waiting 1.5 second before request ${i + 1}...`);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                payload.page = i;
                await make_request(apiUrl, programi);
            }

            fs.writeFileSync("./programi.json", JSON.stringify(programi, null, 2), 'utf8');
        })
        .catch((error) => {
            console.log("Error details:");
            if (error.response) {
                // Server responded with a status other than 200 range
                console.log("Status:", error.response.status);
                console.log("Headers:", error.response.headers);
                console.log("Data:", error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.log("No response received:", error.request);
            } else {
                // Something else happened
                console.log("Error:", error.message);
            }
        });
}

async function make_request(url, programi) {
    return axios.post(url, payload)
        .then((response) => {
            console.log(`Page ${payload.page}: ${response.data.d?.Programi?.length || 0} programs`);
            programi.push(...response.data.d.Programi); // Use spread operator instead of pushing the whole array
        })
        .catch((error) => {
            console.log("Error details:");
            console.log("Erorr on page ", payload.page);
            if (error.response) {
                // Server responded with a status other than 200 range
                console.log("Status:", error.response.status);
                console.log("Headers:", error.response.headers);
                console.log("Data:", error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.log("No response received:", error.request);
            } else {
                // Something else happened
                console.log("Error:", error.message);
            }
        });
}
    
async function compare_options() {
    const options = fs.readFileSync("./options.html", "utf8");
    if ( _options === options) {
        console.log("No change.");
        return 1;
    }

    console.log("Change detected");
    // What if the change is due to some error occuring?
    // I don't really expect any changes except for maybe sastavnice and programi, anyways
    // but I will be handling that seperately, so maybe I can wait with the implementation

}