import Chart from 'chart.js/auto'

const strapiURL = 'https://gestionweb.frlp.utn.edu.ar/api/g36-lenguajes';
const strapiToken = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';

const tmdbURL = 'https://api.themoviedb.org/3'
const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWRiMDVkYWFjMzcxODliNzAwNzljMGVhOTU0YzM4ZiIsIm5iZiI6MTc1MjI0NDE5MS4wNDE5OTk4LCJzdWIiOiI2ODcxMWZkZmE3MjJkMzg5NGIxMDU0YTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dSybnoW6qPincyRaaeMh3J7WUTOLrMyvO9Nk-RTGb84';

var chart;

async function getLangDocId(tag) {
    const res = await fetch(`${strapiURL}?filters[name][$eq]=${tag}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${strapiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        console.error(await res.error());
        return ""
    } else {
        const data = await res.json()
        return data.data[0].documentId;
    }
}

async function cargarDatos(){
    var langs = {};
    var headers = { headers: {
        Authorization: `Bearer ${tmdbToken}`, 
        "Content-Type": "application/json",
    }};
    var res = await fetch(`${tmdbURL}/configuration/languages`, headers);
    const langData = await res.json();
    res = await fetch(`${tmdbURL}/movie/popular`, headers);
    const movieData = await res.json();
    try {
        langData.forEach((lang) => langs[lang.iso_639_1] = { name: lang.english_name, count: 0 });
        movieData.results.forEach((result) => {
            langs[result.original_language].count++;
        });
    } catch {
        console.log(await res.error());
    }
    headers.headers.Authorization = `Bearer ${strapiToken}`;
    for (var key in langs) {
        if (langs[key].count == 0) {
            continue;
        }
        const data = {
            data: {
                tag: key,
                name: langs[key].name,
                count: langs[key].count,
            },
        };
        var options = { method: "",
            ...headers,
            body: JSON.stringify(data),
        };
        const docId = await getLangDocId(data.data.name);
        (docId != "") ? options.method = "PUT" : options.method = "POST";
        res = await fetch(`${strapiURL}/${docId}`, options);
        if (!res.ok) {
            console.error(await res.error());
        } else {
            console.log(await res.json());
        }
    }
}

async function visualizarDatos(){
    const res = await fetch(`${strapiURL}?sort=count:Desc&pagination[start]=0&pagination[limit]=3`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${strapiToken}`,
            "Content-Type": "application/json",
        },
    });
    try {
        const data = (await res.json()).data
        if (chart) {
            chart.destroy()
        }
        chart = new Chart(
            document.getElementById('idiomas'),
            {
                type: 'doughnut',
                data: {
                    labels: data.map(row => row.name),
                    datasets: [{
                        label: 'Conteo',
                        data: data.map(row => row.count),
                        hoverOffset: 4
                    }]
                }
            }
        );
    } catch {
        console.error(await res.error());
    }
}

document.getElementById("cargarBoton").addEventListener('click', cargarDatos);
document.getElementById("visualizarBoton").addEventListener('click', visualizarDatos);
