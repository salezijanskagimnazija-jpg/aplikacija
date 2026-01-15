async function getData(PATH) {
    try {
        const response = await fetch(PATH);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function main() {
    const ID = localStorage.getItem("idPrograma");

    let programi = await getData("../public/programi.json");

    let program = programi.filter((obj) => {
        return obj.idPrograma == ID;
    })[0];

    console.log(program)
    document.querySelector("h1.title").innerHTML = program.naziv;
}

main();