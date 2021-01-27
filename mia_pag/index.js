var mymap = L.map('mapid').setView([45.505, 9.09], 5);
"use strict";

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

// L.marker([51.5, -0.09]).addTo(mymap)
//     .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// L.circle([51.508, -0.11], 500, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5
// }).addTo(mymap).bindPopup("I am a circle.");

// L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(mymap).bindPopup("I am a polygon.");


// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }

// mymap.on('click', onMapClick);


$(() => {

    $.get("/ultime").then(regioni => {
        let marker;
        console.log(`regioni`, regioni);
        for (let i = 0; i < regioni.length; i++) {
            let reg = regioni[i]
            switch (reg.area) {
                case "LOM":
                    marker = { lat: 45.498647, lon: 9.162598 }
                    break;
                case "PIE":
                    marker = { lat: 45.073521, lon: 7.69043 }
                    break;
                case "TOS":
                    marker = { lat: 43.771094, lon: 11.239014 }
                    break;
                case "CAM":
                    marker = { lat: 40.838749, lon: 14.337158 }
                    break;
                case "BAS":
                    marker = { lat: 40.663973, lon: 15.820313 }
                    break;
                case "PUG":
                    marker = { lat: 41.178654, lon: 16.896973 }
                    break;
                case "MOL":
                    marker = { lat: 41.566142, lon: 14.655762 }
                    break;
                case "ABR":
                    marker = { lat: 42.374778, lon: 13.414307 }
                    break;
                case "PAT":
                    marker = { lat: 46.065608, lon: 11.162109 }
                    break;
                case "FVG":
                    marker = { lat: 45.675482, lon: 13.787842 }
                    break;
                case "CAL":
                    marker = { lat: 38.873929, lon: 16.611328 }
                    break;
                case "SIC":
                    marker = { lat: 38.091337, lon: 13.348389 }
                    break;
                case "SAR":
                    marker = { lat: 39.240763, lon: 9.162598 }
                    break;
                case "PAB":
                    marker = { lat: 46.483265, lon: 11.337891 }
                    break;
                case "MAR":
                    marker = { lat: 43.604262, lon: 13.52417 }
                    break;
                case "UMB":
                    marker = { lat: 43.109004, lon: 12.414551 }
                    break;
                case "LIG":
                    marker = { lat: 44.394542, lon: 8.97583 }
                    break;
                case "EMR":
                    marker = { lat: 44.504341, lon: 11.37085 }
                    break;
                case "VDA":
                    marker = { lat: 45.713851, lon: 7.23999 }
                    break;
                case "VEN":
                    marker = { lat: 45.506347, lon: 12.348633 }
                    break;
                case "ITA":
                default:
                    break;
            }
            L.circle([marker.lat, marker.lon], 800 * reg.percentuale_somministrazione, { color: ["red", "blue", "yellow", "green"][Math.abs(3 - Math.round(Math.random() * 3))] }).addTo(mymap).bindPopup(
                `Regione: <strong><b>${reg.area}</b></strong><br>
                
                dosi_consegnate: <b>${reg.dosi_consegnate}</b><br>
                ​​
                dosi_somministrate: <b>${reg.dosi_somministrate}</b><br>
                ​​
                percentuale_somministrazione: <b>${reg.percentuale_somministrazione}%</b>`
            )
        }
    })

    $.get("/storicoNazionale").then(storicoNazionale => {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: storicoNazionale.map(element => element.data_somministrazione.substring(0, 10)),
                datasets: [{
                    label: 'andamento giornaliero Nazionale',
                    data: storicoNazionale.map(element => element.totale),
                    borderColor: ['rgba(255, 99, 132, 1)'],
                    pointHitRadius: 50,
                    fill: false,
                }]
            },
            options: {

                pointRadius: 6,
                responsive: true,
                title: {
                    display: true,
                    text: "CODIV-19 Vaccines Data in Italy"
                },
                scales: {
                    xAxes: [
                        {
                            display: true
                        }
                    ],
                    yAxes: [
                        {
                            display: true
                        }
                    ]
                }
            }
        });
    });

    $.get("/storicoRegionale").then(storicoRegionale => {

        sigleRegioni = []
        for (let i = 0; i < 20; i++) {
            sigleRegioni.push(storicoRegionale[i].area)
        }

        console.log(`storicoRegionale`, storicoRegionale);

        var ctx = document.getElementById('myChart2').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: storicoRegionale.filter(element => element.area == "LOM").map(element => element.data_somministrazione.substring(0, 10)),
                datasets: /*[{
                    label: '',
                    data: storicoRegionale.filter(element => element.area==sigleRegioni[i]),
                    backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)'],
                    // borderWidth: 1,
                    fill: false,
                }]*/
                    sigleRegioni.map(sigla => {
                        return {
                            label: sigla, data: storicoRegionale.filter(element => element.area == sigla).map(ele => ele.totale),
                            borderColor: [`rgba(${Math.abs(Math.random() * 255)}, ${Math.abs(Math.random() * 255)}, ${Math.abs(Math.random() * 255)}, 1)`],
                            fill: false,
                            pointHitRadius: 50
                        }
                    })
            },
            options: {

                pointRadius: 6,
                responsive: true,
                title: {
                    display: true,
                    text: "CODIV-19 Vaccines Data in Italy's Regions"
                },
                scales: {
                    xAxes: [
                        {
                            display: true
                        }
                    ],
                    yAxes: [
                        {
                            display: true
                        }
                    ]
                }
            }
        });
    });


    $.get("/ultime").then(attualePerRegioni => {

        let sommaNaz = 0, media = 0, dosi_consegnate = 0;
        attualePerRegioni.forEach(reg => sommaNaz += reg.dosi_somministrate);
        attualePerRegioni.forEach(reg => dosi_consegnate += reg.dosi_consegnate);
        attualePerRegioni.map(reg => reg.percentuale_somministrazione).forEach(perc => media += perc)
        media = media / 21

        $("#totali").text(Number(sommaNaz).toLocaleString())//TOTALE VACC FATTE IN ITALIA(=somma vacc fatte x regione)
        $("#percentuale_somministrazione").text(Number(media).toFixed(1).toLocaleString() + " %")//percentuale_somministrazione IN ITALIA(=avg percentuale_somministrazione x regione)
        $("#dosi_consegnate").text(Number(dosi_consegnate).toLocaleString())//dosi_consegnate IN ITALIA(=somma dosi_consegnate x regione)
    });

});