import logger from '../utils/logger.js';

/**
 * Add default options to the select elements.
 * @param {HTMLSelectElement} selectUcilista        - The select element for ucilista 
 * @param {HTMLSelectElement} selectSastavnice      - The select element for sastavnice ucilista
 */
function add_default_options(selectUcilista, selectSastavnice) {
    console.log("Adding default options...");
    let option = new Option('Sva visoka učilišta', "-1");
    selectUcilista.add(option);
    option = new Option('Sve sastavnice', "-1");
    selectSastavnice.add(option);
}

/**
 * Add options, filter by vrsta (-1 is all), to the Ucilista and Sastavnice select elements.
 * @param {HTMLSelectElement} selectUcilista    - The select element for ucilista. 
 * @param {HTMLSelectElement} selectSastavnice  - The select element for sastavnice.
 * @param {object} ucilista          - An json object containing all of the ucilista, their ids,
 *                                  names, and the same info for all of their sastavnice
 * @param {number} vrsta             - Vrsta ucilista, -1 is the default (all options), look at the first
 *                                  select element in scrape.html for other options and their values.
 */
function add_options(selectUcilista, selectSastavnice, ucilista, vrsta) {
    console.log("Adding options...");
    add_default_options(selectUcilista, selectSastavnice);

    let ucilista_vrsta = null;
    // If vrsta == -1 (default) show all options, otherwise filter by vsta
    if (vrsta == -1) {
        console.log("Adding all options...")
        ucilista_vrsta = ucilista;
    } else {
        console.log("Adding only options of the vrsta: ", vrsta);
        ucilista_vrsta =  Object.fromEntries(
            Object.entries(ucilista).filter(([id, uciliste]) => uciliste.vrsta == vrsta)
        )
    }

    let option, id, name = null;
    let uciliste_index, sastavnica_index = 1;
    for (let uciliste in ucilista_vrsta) {
        logger.line();
        console.log("Adding options for:", ucilista_vrsta[uciliste]);
        name = ucilista_vrsta[uciliste].name;
        console.log("Name and id: ", name, uciliste);

        option = new Option(name, uciliste);
        selectUcilista.add(option, uciliste_index++);

        let sastavnice = ucilista_vrsta[uciliste].sastavnice;
        for (let sastavnica in sastavnice) {
            console.log("Adding:", sastavnice[sastavnica]);
            id = sastavnice[sastavnica].id;
            name = sastavnice[sastavnica].name;
            console.log("Sastavnica name and id:", name, id)

            option = new Option(name, id);
            selectSastavnice.add(option, sastavnica_index++);
        }
        logger.line();
    }

    console.log("Options addedd...");
}

/**
 * Clears options from select elements for ucilista and sastavnice.
 * @param {HTMLSelectElement} selectUcilista    - Select element for ucilista.
 * @param {HTMLSelectElement} selectSastavnice  - Select element for sastavnice.
 */
function clear_options(selectUcilista, selectSastavnice) {
    // clear select element
    selectUcilista.innerHTML = "";
    selectSastavnice.innerHTML = "";
}

console.log("Fetching ucilista.json...");
let ucilista = null;
fetch("./data/ucilista.json")
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data);
        ucilista = data;

        let selectUcilista = document.getElementById("Ucilista");
        let selectSastavnice = document.getElementById("Sastavnice");

        add_options(selectUcilista, selectSastavnice, ucilista, -1);

        document.getElementById("search-btn").addEventListener("click", scrapePrograms);
        document.getElementById("VrstaUcilista").addEventListener("change", function () {
            let vrsta = document.getElementById("VrstaUcilista").value;

            logger.line("=");
            console.log("Selected vrsta: ", vrsta);
            logger.line("=");

            let selectUcilista = document.getElementById("Ucilista");
            let selectSastavnice = document.getElementById("Sastavnice");

            clear_options(selectUcilista, selectSastavnice);
            
            add_options(selectUcilista, selectSastavnice, ucilista, vrsta);
        });
    })
    .catch (error => {
        console.error("Error fetching: ", error);
    });



const url = "https://www.postani-student.hr/webservices/Pretraga.svc/PretraziPrograme";
const proxy = 'https://corsproxy.io/?url=';

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

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.postani-student.hr/Ucilista/Nositelji.aspx',
    'Origin': 'https://www.postani-student.hr',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

function compare_to_original(lista) {
    let original_lista = ["-1","67","71","70","35","249","56","261","51","275","206","10","31","38","59","251","11","286","256","84","205","232","54","290","291","16","37","73","39","108","269","242","103","53","52","278","240","105","63","267","272","89","243","271","293","270","225","83","237","230","216","106","13","28","66","23","44","50","107","32","61","14","65","77","148","47","69","80","36","263","95","109","9","268","210","274","81","29","96","110","265","78","64","294","72","85","262","183","181","21","215","192","184","185","20","186","187","193","255","231","190","180","22","188","189","247","220","194","195","196","191","207","197","254","198","201","199","202","200","203","34","40","182","246","82","93","97","58","12","57","98","62","75","68","112","264","218","99","100","288","25","287","125","223","289","48","49","258","30","239","260","116","113","224","94","114","42","101","117","118","119","292","213","280","136","277","281","144","146","282","147","120","279","122","124","142","126","115","150","152"];
    
    const originalIds = new Set(original_lista);
    const ids = new Set(lista);

    const missing = [...originalIds].filter(id => !ids.has(id));

    const extra = [...ids].filter(id => !originalIds.has(id));

    console.log("Missing: ", missing);
    console.log("Extra: ", extra);
}

/**
 * Function that makes the lista of all the sastavnica ids that
 * should go into the payload.
 * @param {*} ucilista  - an object containing all of their ids, vrsta and names, as well
 * as their sastavnica alongside their ids and names
 * @returns {Array}     - an array of the (filtered) ids that go into the payloads lista 
 */
function make_payload_lista(ucilista) {
    let lista = [];
    let sastavnica_value = document.getElementById("Sastavnice").value;
    // check if sastavnica was selected
    if (sastavnica_value !== "-1") {
        console.log("Sastavnica: ", sastavnica_value, " selected.")
        return lista = [sastavnica_value];
    } 

    // Sve sastavnice and reset the payload
    lista = ["-1"];
    console.log('Sve sastavnice selected.');

    let ucilista_value = document.getElementById("Ucilista").value

    // if uciliste selected, list only it's sasatavnice
    if (ucilista_value !== "-1") {
        let uciliste = ucilista[ucilista_value];
        console.log("Selected: ", uciliste.name);
        for (let sastavnica in uciliste.sastavnice) {
            lista[parseInt(sastavnica) + 1] = uciliste.sastavnice[sastavnica].id;
        }
        return lista;
    }

    console.log("Sva ucilista selected.")

    // check if vrsta was set
    let vrsta = document.getElementById("VrstaUcilista").value
    let ucilista_vrsta = null;
    if (vrsta == "-1") {
        console.log("Sve vrste selected.");
        ucilista_vrsta = ucilista;
    } else {
        ucilista_vrsta = Object.fromEntries(
            Object.entries(ucilista).filter(([id, uciliste]) => uciliste.vrsta == vrsta)
        )
    }

    let i = 1;
    for (let uciliste in ucilista_vrsta) {
        let sastavnice = ucilista_vrsta[uciliste].sastavnice;
        for (let sastavnica in sastavnice) {
            lista[i++] = sastavnice[sastavnica].id;
        }
    }

    return lista;
}

let TotalPages = null;
/**
 * Scrape programs data from postani-student.hr using axios.
 */
async function scrapePrograms() {;
    try {
        payload.lista = make_payload_lista(ucilista);
        console.log("ID list: ", payload.lista);

        let mjesto = document.getElementById("Mjesto").value;
        payload.Mjesto = (mjesto == "-1")? "Sva mjesta" : mjesto;

        console.log("Payload generated: ", payload)
        axios.post(proxy + url, payload)
        .then((response) => {
            console.log("First request!")
            console.log(response.data);

            let data = response.data.d;
            
            document.getElementById("page-number").innerHTML = "Trenutna stranica:" +
                data.CurrentPage + " od " + data.TotalPages;

            let programi_table = document.getElementById("programi-table");
            let programi = data.Programi;

            for (let program in programi) {
                let new_row = programi_table.insertRow(-1);

                let cell = new_row.insertCell(0);
                cell.innerHTML = programi[program].naziv;

                cell = new_row.insertCell(1);
                cell.innerHTML = programi[program].mjesto;

                cell = new_row.insertCell(2);
                cell.innerHTML = programi[program].programi;
            }

            document.getElementById("programi-container").classList.remove("hidden");
        })
    } catch (error) {
        console.log(error);
    }
}