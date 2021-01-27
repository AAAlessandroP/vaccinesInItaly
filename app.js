const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.static("mia_pag"));
const listener = app.listen(process.env.PORT || 3000)


fetch("https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json").then(json => {
    json.json().then(got => {
        // console.log(`got`, got);
        app.get("/ultime", (req, res) => {
            res.json(got.data.sort((a, b) => b.dosi_somministrate - a.dosi_somministrate));
        })
    })
})

fetch("https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.json").then(json => {
    json.json().then(got => {
        app.get("/storicoNazionale", (req, res) => {
            let storicoNazionale = got.data.filter(item => item.area == "ITA")

            res.json(storicoNazionale.map(ele => {
                return {
                    totale: ele.totale,
                    data_somministrazione: ele.data_somministrazione,
                    prima_dose: ele.prima_dose,
                    seconda_dose: ele.seconda_dose,
                }
            }));
        })

        app.get("/storicoRegionale", (req, res) => {
            let storicoNazionale = got.data.filter(item => item.area != "ITA")
            res.json(storicoNazionale.map(ele => {
                return {
                    totale: ele.totale,
                    area: ele.area,
                    data_somministrazione: ele.data_somministrazione,
                    prima_dose: ele.prima_dose,
                    seconda_dose: ele.seconda_dose
                }
            })
            );
        });

    })
})

