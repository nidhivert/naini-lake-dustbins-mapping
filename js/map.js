const map = L.map("map");

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


fetch("data/dustbins_clean.csv")
    .then(response => response.text())
    .then(csvText => {

        const rows = csvText.trim().split("\n");

        const dustbins = rows
            .slice(1)
            .filter(row => row.trim() !== "")
            .map(row => {

                const values = row.split(",");

                return {
                    id: values[0].trim(),
                    latitude: values[1].trim(),
                    longitude: values[2].trim(),
                    type: values[3].trim(),
                    overflow: values[4].trim(),
                    photo: values[5] ? values[5].trim() : ""
                };
            });


        // --------------------------------
        // CREATE POPUP CONTENT
        // --------------------------------

        function createPopupContent(dustbin) {

            let photoHTML = "";

            if (
                dustbin.photo &&
                dustbin.photo !== "nan" &&
                dustbin.photo !== "NaN"
            ) {

                const imagePath =
                    `images/${encodeURIComponent(dustbin.photo)}`;

                photoHTML = `
                    <div class="dustbin-photo-container">
                        <img
                            src="${imagePath}"
                            alt="Photograph of Dustbin ${dustbin.id}"
                            class="dustbin-photo"
                        >
                    </div>
                `;
            }


            return `
                <div class="dustbin-popup">

                    <strong>Dustbin ID:</strong>
                    ${dustbin.id}<br>

                    <strong>Type:</strong>
                    ${dustbin.type}<br>

                    <strong>Overflow:</strong>
                    ${dustbin.overflow}

                    ${photoHTML}

                </div>
            `;
        }


        // --------------------------------
        // DUSTBIN MARKERS
        // --------------------------------

        const dustbinMarkers = L.layerGroup();

        dustbins.forEach(dustbin => {

            const marker = L.circleMarker(
                [
                    Number(dustbin.latitude),
                    Number(dustbin.longitude)
                ],
                {
                    radius: 5,
                    color: "black",
                    fillColor: "white",
                    fillOpacity: 0.9,
                    weight: 1
                }
            );

            marker.bindPopup(
                createPopupContent(dustbin)
            );

            dustbinMarkers.addLayer(marker);
        });

        dustbinMarkers.addTo(map);


        // --------------------------------
        // HEATMAP
        // --------------------------------

        const heatPoints = dustbins.map(dustbin => [

            Number(dustbin.latitude),
            Number(dustbin.longitude),
            1

        ]);

        const heatLayer = L.heatLayer(
            heatPoints,
            {
                radius: 18,
                blur: 12,
                maxZoom: 17
            }
        );

        heatLayer.addTo(map);


        // --------------------------------
        // INITIAL MAP VIEW
        // --------------------------------

        map.fitBounds(
            dustbins.map(dustbin => [
                Number(dustbin.latitude),
                Number(dustbin.longitude)
            ])
        );


        // --------------------------------
        // LAYER CONTROL
        // --------------------------------

        const baseLayers = {};

        const overlayLayers = {

            "Dustbin Locations":
                dustbinMarkers,

            "Dustbin Density":
                heatLayer

        };

        L.control.layers(
            baseLayers,
            overlayLayers,
            {
                collapsed: false
            }
        ).addTo(map);


        // --------------------------------
        // DUSTBIN TYPE COUNTS
        // --------------------------------

        const typeCounts = {};

        dustbins.forEach(dustbin => {

            const type = dustbin.type;

            if (typeCounts[type]) {

                typeCounts[type]++;

            } else {

                typeCounts[type] = 1;

            }

        });


        const typeLabels =
            Object.keys(typeCounts);

        const typeValues =
            Object.values(typeCounts);

        const totalDustbins =
            dustbins.length;


        // --------------------------------
        // KEY FINDING
        // --------------------------------

        const largestType =
            typeLabels.reduce(
                (a, b) =>
                    typeCounts[a] > typeCounts[b]
                        ? a
                        : b
            );

        const largestTypeCount =
            typeCounts[largestType];


        document.querySelector(
            ".chart-insight"
        ).innerHTML = `

            <strong>Key finding:</strong>

            ${largestType} dustbins account
            for the largest share of mapped
            observations
            (${largestTypeCount} of ${totalDustbins}).

        `;


        // --------------------------------
        // CHART
        // --------------------------------

        const ctx =
            document.getElementById("typeChart");

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: typeLabels,

                datasets: [

                    {
                        label: "Number of Dustbins",
                        data: typeValues
                    }

                ]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            stepSize: 1
                        }

                    }

                }

            }

        });


        // --------------------------------
        // TYPE FILTER
        // --------------------------------

        const typeFilter =
            document.getElementById("typeFilter");


        typeFilter.addEventListener(
            "change",
            function () {

                const selectedType =
                    this.value;

                const filterCount =
                    document.getElementById(
                        "filterCount"
                    );


                // Remove existing markers

                dustbinMarkers.clearLayers();


                // Add filtered markers

                dustbins.forEach(dustbin => {

                    if (
                        selectedType === "All" ||
                        dustbin.type === selectedType
                    ) {

                        const marker =
                            L.circleMarker(
                                [
                                    Number(
                                        dustbin.latitude
                                    ),
                                    Number(
                                        dustbin.longitude
                                    )
                                ],
                                {
                                    radius: 5,
                                    color: "black",
                                    fillColor: "white",
                                    fillOpacity: 0.9,
                                    weight: 1
                                }
                            );


                        marker.bindPopup(
                            createPopupContent(
                                dustbin
                            )
                        );


                        dustbinMarkers.addLayer(
                            marker
                        );

                    }

                });


                // Count visible dustbins

                const visibleCount =
                    dustbins.filter(
                        dustbin =>
                            selectedType === "All" ||
                            dustbin.type === selectedType
                    ).length;


                filterCount.textContent =
                    `Showing ${visibleCount} of ${dustbins.length} dustbins`;


                // Filter heatmap

                const filteredDustbins =
                    dustbins.filter(
                        dustbin =>
                            selectedType === "All" ||
                            dustbin.type === selectedType
                    );


                const filteredHeatPoints =
                    filteredDustbins.map(
                        dustbin => [

                            Number(
                                dustbin.latitude
                            ),

                            Number(
                                dustbin.longitude
                            ),

                            1

                        ]
                    );


                heatLayer.setLatLngs(
                    filteredHeatPoints
                );


                // Zoom to filtered points

                if (
                    filteredDustbins.length > 0
                ) {

                    map.fitBounds(

                        filteredDustbins.map(
                            dustbin => [

                                Number(
                                    dustbin.latitude
                                ),

                                Number(
                                    dustbin.longitude
                                )

                            ]
                        ),

                        {
                            padding: [30, 30]
                        }

                    );

                }

            }
        );

    })

    .catch(error => {

        console.error(
            "Error loading CSV:",
            error
        );

    });


// --------------------------------
// DENSITY LEGEND
// --------------------------------

const densityLegend =
    L.control({
        position: "bottomright"
    });


densityLegend.onAdd =
    function () {

        const div =
            L.DomUtil.create(
                "div",
                "density-legend"
            );


        div.innerHTML = `

            <strong>Dustbin Density</strong>

            <div class="gradient-bar"></div>

            <div class="legend-labels">

                <span>Low</span>

                <span>High</span>

            </div>

        `;


        return div;

    };


densityLegend.addTo(map);