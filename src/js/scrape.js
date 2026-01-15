import logger from '../utils/logger.js';

main();

/**
 * Application Entry Point
 * 
 * This is the main entry function that initializes and runs the entire aplication.
 * It serves as the starting point for all aplication logic.
 * 
 * @function main
 * @entrypoint
 * @async 
 * @returns {void}
 */
async function main() {
    try {
        await initOptions();

        let data = await getUcilista();

        let ucilista = data;

        initButtons(ucilista);

        document.getElementById("VrstaUcilista").addEventListener("change", () => {
            filter(ucilista);
        });

        document.getElementById("Ucilista").addEventListener("change", () => {
            filter(ucilista);
        });

        document.getElementById("Sastavnice").addEventListener("change", () => {
            filter(ucilista);
        });

        document.getElementById("Mjesto").addEventListener("change", () => {
            filter(ucilista);
        });

        console.log('App ready.');
    } catch (error) {
        console.error('Failed to start app:', error);
    }
}

/**
 * Filters options according to vrsta selected.
 * 
 * @param {object} ucilista - Ucilista information object.
 * @see {@link ../data/ucilista.json} for the exact structure.
 */
function filter(ucilista) {
    let vrsta = document.getElementById("VrstaUcilista").value;
    let uciliste = document.getElementById("Ucilista").value;
    let sastavnica = document.getElementById("Sastavnice").value;
    let mjesto = document.getElementById("Mjesto").value;

    logger.line("=", 10);
    console.log("Selected vrsta: ", vrsta);

    let selectUcilista = document.getElementById("Ucilista");
    let selectSastavnice = document.getElementById("Sastavnice");
    let selectMjesta = document.getElementById("Mjesto");

    clear_options(selectUcilista, selectSastavnice, selectMjesta);
    
    add_options(selectUcilista, selectSastavnice, selectMjesta, ucilista, vrsta, uciliste, sastavnica, mjesto);
}

function initButtons(ucilista) {
    document.getElementById("search-btn").addEventListener("click", () => {
        payload.page = 1;           // reset page so that every search starts from page 1
        scrapePrograms(ucilista);
    });

    document.querySelectorAll(".next-btn").forEach(button => {
        button.addEventListener("click", () => {
            next_page(ucilista)
        });
    });

    document.querySelectorAll(".previous-btn").forEach(button => {
        button.addEventListener("click", () => {
            previous_page(ucilista)
        });
    });

    document.getElementById("close-btn").addEventListener("click", () => {
        document.getElementById("widget-container").classList.add("hidden");
    });
}

/**
 * Add default options to the select elements.
 * @param {HTMLSelectElement} selectUcilista        - The select element for ucilista 
 * @param {HTMLSelectElement} selectSastavnice      - The select element for sastavnice ucilista
 */
function add_default_options(selectUcilista, selectSastavnice, selectMjesta) {
    console.log("Adding default options...");
    let option = new Option('Sva visoka učilišta', "-1");

    option.setAttribute("selected", "selected");
    selectUcilista.add(option);

    option = new Option('Sve sastavnice', "-1");
    option.setAttribute("selected", "selected");
    selectSastavnice.add(option);

    option = new Option('Sva mjesta', "-1");
    option.setAttribute("selected", "selected");
    selectMjesta.add(option);
}

/**
 * Filters the ucilista object by vrsta ucilista.   
 * @param {number} vrsta    - vrsta ucilista
 * @param {object} ucilista - An object containing ucilista and their vrsta alongside
 * other info.
 * @returns {object} - ucilista filtered by vrsta
 */
function filter_by_vrsta(vrsta, ucilista) {
    // If vrsta == -1 (default) show all options, otherwise filter by vsta
    if (vrsta == -1) {
        console.log("Adding all options...")
        return ucilista;
    } else {
        console.log("Adding only options of the vrsta: ", vrsta);
        return  Object.fromEntries(
            Object.entries(ucilista).filter(([id, uciliste]) => uciliste.vrsta == vrsta)
        )
    }
}

/**
 * 
 * @param {*} sastavnica 
 * @param {*} ucilista 
 * @returns 
 */
function findUcilisteBySastavnica(sastavnica, ucilista) {
    for (let uciliste in ucilista) {
        for (let s in ucilista[uciliste].sastavnice) {
            
            if (ucilista[uciliste].sastavnice[s].id == sastavnica) {
                return {
                    sastavnica_id: ucilista[uciliste].sastavnice[s].id,
                    sastavnica_name: ucilista[uciliste].sastavnice[s].name,
                    uciliste_id: uciliste,
                    uciliste_name: ucilista[uciliste].name,
                    mjesta: ucilista[uciliste].sastavnice[s].mjesta
                }
            }
        }
    }
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
function add_options(selectUcilista, selectSastavnice, selectMjesta, ucilista, vrsta, uciliste, sastavnica, mjesto) {
    console.log("Adding options...");
    add_default_options(selectUcilista, selectSastavnice, selectMjesta);

    let mjesta = [];
    for (let u in ucilista) {
        let u_added = false;
        if (vrsta == "-1" || ucilista[u].vrsta == vrsta) {
            console.log("v")
            if (uciliste == "-1" || uciliste == u) {
                console.log("u")
                ucilista[u].sastavnice.forEach((s) => {
                    let s_added = false;
                    if (sastavnica == "-1" || sastavnica == s.id) {
                        console.log("s")
                        s.mjesta.forEach((m) => {
                            if (mjesto == "-1" || m == mjesto) {
                                console.log("m")
                                if (!u_added) {
                                    console.log("Uciliste:", ucilista[u].name);
                                    let option = new Option(ucilista[u].name, u);
                                    if (uciliste != "-1") {
                                        option.setAttribute("selected", "selected");
                                    }
                                    selectUcilista.add(option);
                                    u_added = true;
                                }

                                if (!s_added) {
                                    console.log("Sstavnica", s.name);
                                    let option = new Option(s.name, s.id);
                                    if (sastavnica != "-1") {
                                        option.setAttribute("selected", "selected");
                                    }
                                    selectSastavnice.add(option);
                                    s_added = true;
                                }

                                if (!mjesta.includes(m)) {
                                    mjesta.push(m);

                                    console.log("Mjesto", m)
                                    let option = new Option(m, m);
                                    if (m == mjesto) {
                                        option.setAttribute("selected", "selected");
                                    }
                                    selectMjesta.add(option);
                                }
                            }
                        })
                    }
                });
            }
        }
    }
}

/**
 * Clears options from select elements for ucilista and sastavnice.
 * @param {HTMLSelectElement} selectUcilista    - Select element for ucilista.
 * @param {HTMLSelectElement} selectSastavnice  - Select element for sastavnice.
 * @param {HTMLSelectElement}
 */
function clear_options(selectUcilista, selectSastavnice, selectMjesta) {
    // clear select element
    selectUcilista.innerHTML = "";
    selectSastavnice.innerHTML = "";
    selectMjesta.innerHTML = "";
}

async function getUcilista() {
    console.log("Fetching ucilista.json...");

    let ucilista = null;
    try {
        const response = await fetch("../public/ucilista.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

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

function clean_programi() {
    let table = document.getElementById("programi-table");
    let tbody = table.querySelector("tbody");
    let rows = tbody.querySelectorAll("tr");

    rows.forEach((row) => {
        row.remove();
    })
}

const widget_url = 'https://www.postani-student.hr/usercontrols/uvjeticontainer.aspx?id=';

function display_widget(id) {
    document.querySelector("iframe").srcDoc = "";

    const url = widget_url + id;

    return axios.get(url)
        .then(response => {
            console.log(response.data); // Logs the fetched data
            document.querySelector("iframe").srcdoc = response.data;
        
            document.getElementById("widget-container").classList.remove("hidden");
            return true;
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            return false;
        });
}

function scrollToWidget() {
    const iframe = document.querySelector("iframe");
    iframe.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'center'
    });
}

function openProgramPage(event) {
    window.location.assign("program_n.html");
}
/**
 * Popuplates the programi table with scraped programi data for a single page.
 * @param {*} data - the (`response.data.d) object from the response to the axios post request.
 */
function populate_programi(data) {
    let table = document.getElementById("programi-table");
    let tbody = table.querySelector("tbody");
    let programi = data.Programi;

    for (let program in programi) {
        let new_row = tbody.insertRow(-1);

        let cell = new_row.insertCell(0);
        cell.innerHTML = programi[program].naziv;
        cell.addEventListener("click", async (event) => {
            event.preventDefault();

            // await display_widget(programi[program].idPrograma);

            // scrollToWidget();

            localStorage.setItem("idPrograma", programi[program].idPrograma);

            openProgramPage(event);
        });

        cell = new_row.insertCell(1);
        cell.innerHTML = programi[program].mjesto;

        cell = new_row.insertCell(2);
        cell.innerHTML = programi[program].programi;
    }
}

/**
 * Updates the payload to select the next page, that is next batch of programs.
 */
function next_page(ucilista) {
    payload.page++;
    scrapePrograms(ucilista);
}

function previous_page(ucilista) {
    payload.page--;
    scrapePrograms(ucilista);
}

function show_next_button() {
    document.querySelectorAll(".next-btn").forEach(button => {
        button.classList.remove("hidden");
    });
}

function hide_next_button() {
    document.querySelectorAll(".next-btn").forEach(button => {
        button.classList.add("hidden");
    });
}

// having a previous and a next button that are almost identical, seems redundant
function show_previous_button() {
    document.querySelectorAll(".previous-btn").forEach(button => {
        button.classList.remove("hidden");
    });
}

function hide_previous_button() {
    document.querySelectorAll(".previous-btn").forEach(button => {
        button.classList.add("hidden");
    });
}


function pager(data) {
    document.getElementById("page-number").innerHTML = "Trenutna stranica:" +
        data.CurrentPage + " od " + data.TotalPages;

    if (data.CurrentPage == 1) {
        hide_previous_button();
        data.CurrentPage === data.TotalPages ? hide_next_button() : show_next_button();
    } else if (data.CurrentPage < data.TotalPages) {
        show_next_button();
        show_previous_button();
    } else {
        hide_next_button();
        show_previous_button();
    }

}

/**
 * Scrape programs data from postani-student.hr using axios.
 */
async function scrapePrograms(ucilista) {;
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
            clean_programi();
            populate_programi(data);
            document.getElementById("programi-container").classList.remove("hidden");

            pager(data);

        })
    } catch (error) {
        console.log(error);
    }
}

async function getOptions(url) {
    console.log("Fetching options...");

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Options fetched.');
        return data;
    } catch (error) {
        console.error('Fetching failed:', error);
        throw error;
    }
}

async function initOptions() {
    const URL = "../../public/options.json";
    
    try {
        const options = await getOptions(URL);
        logger.line();
        console.log("Options", options);
        logger.line();

        const selectElements = document.querySelectorAll("select");
        console.log(selectElements);

        let index = 0;
        for (let select in options) {
            let selectElement = selectElements[index++];
            for (let option in options[select]) {
                let _option = new Option(option, options[select][option]);

                selectElement.add(_option);
                if (_option.value == "-1") {
                    _option.setAttribute("selected", "selected");
                }
            }
        }

        return true;
    } catch (error) {
        console.error("Failed to initialize options:", error);
        return false;
    }
}