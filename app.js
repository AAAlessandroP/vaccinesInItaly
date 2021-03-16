const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.static("mia_pag"));
const listener = app.listen(process.env.PORT || 3000)


// sasdsad

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


            let totPerData = {}// [data]={prima_dose, seconda_dose}

            got.data.forEach(record => {
                let lui = totPerData[record.data_somministrazione]
                if (lui == undefined)
                    totPerData[record.data_somministrazione] = { prima_dose: record.prima_dose, seconda_dose: record.seconda_dose }
                else
                    totPerData[record.data_somministrazione] = { prima_dose: lui.prima_dose + record.prima_dose, seconda_dose: lui.seconda_dose + record.seconda_dose }
            });

            let sorted = Object.keys(totPerData).map(data => {
                return {
                    data_somministrazione: data,
                    totale: totPerData[data].prima_dose + totPerData[data].seconda_dose,
                    prima_dose: totPerData[data].prima_dose,
                    seconda_dose: totPerData[data].seconda_dose,
                }
            }).sort((obj1, obj2) => {//necessario, sennò al frontend arrivano le date ordinate con codice ascii
                let data1 = new Date(obj1.data_somministrazione)
                let data2 = new Date(obj2.data_somministrazione)
                return data1.getTime() - data2.getTime()
            })

            res.json(sorted)
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
                .sort((obj1, obj2) => {//necessario, sennò al frontend arrivano le date ordinate con codice ascii
                    let data1 = new Date(obj1.data_somministrazione)
                    let data2 = new Date(obj2.data_somministrazione)
                    return data1.getTime() - data2.getTime()
                })
            );
        });

    })
})

