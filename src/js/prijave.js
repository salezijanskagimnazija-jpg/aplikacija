async function getData() {
    const url = "../../public/broj_prijava.json";

    return await fetch(url)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .catch((err) => {
            console.log("Error:", err);
            return null;;
        })
};

async function main() {
    console.log("App starting...");
    const json = await getData();
};

main();