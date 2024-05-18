import { kml } from "https://unpkg.com/@tmcw/togeojson?module";

var planselect = document.getElementById("plan");
var planselect2 = document.getElementById("plan2");
var planselect3 = document.getElementById("plan3");
var comparisonOperators = document.getElementById("comparison-operator");
var inputVal = document.getElementById("inputt");
var buttonQuery = document.getElementById("buttonQuery");
planselect2.style.display = "none";
planselect3.style.display = "none";
comparisonOperators.style.display = "none";
inputVal.style.display = "none";
buttonQuery.style.display = "none";

// var cityName = document.getElementById("cti")

// display variables
var displayMap;
var view;
var gL;

// New
let geojson;
let featureLayer;

let arrayOfKMLs = [
  // "/plan_325.kml",
  "/Plan_397.kml",
  "/Plan_734.kml",
  "/Plan_909.kml",
];

let geoJSONarr = [];
let geojsonsss = addKMLFiles(arrayOfKMLs);
var featureLayers = [];
console.log(featureLayers, "featureLayers global")

function loadModule(moduleName) {
  return new Promise((resolve, reject) => {
    require([moduleName], (module) => {
      if (module) {
        resolve(module);
      } else {
        reject(new Error(`Module not found: ${moduleName}`));
      }
    }, (error) => {
      reject(error);
    });
  });
}

async function initializeMapPlannersWithNewFeatures() {
  try {
    const [esriConfig, WebScene, Map, MapView, Popup, SceneView, intl] =
      await Promise.all([
        loadModule("esri/config"),
        loadModule("esri/WebScene"),
        loadModule("esri/Map"),
        loadModule("esri/views/MapView"),
        loadModule("esri/widgets/Popup"),
        loadModule("esri/views/SceneView"),
        loadModule("esri/intl"),
      ]);

    // intl.setLocale("ar");
    esriConfig.apiKey =
      "AAPK9d68f2e7391f4ae9bca2401b0d18aa6fMkAoYYcSbn1HCZ8REfCmcJb8xxIUQyamDgyaLkNYeeH-QkcGJaZmq3SDAHFxLRU5"; // Will change it
    // esriConfig.apiKey = "AAPK345dec7cdee146c39e98572d5a1f2e9a6ALv3CNwKWD3jBSxJ1K2gjmM0xUGaaEuojnajq9dpbeB1QLEYSayTwyRWWTJNQJk";

    displayMap = new WebScene({
      // basemap: "dark-gray-vector",
      basemap: "hybrid",
      // layers: [layer],
    });

    view = new SceneView({
      // center: [31.233334, 30.033333], // longitude, latitude, centered on Egypt
      center: [45.0792, 23.8859], // longitude, latitude, centered on SA
      container: "displayMap",
      map: displayMap,
      zoom: 5,
      highlightOptions: {
        // color: [255, 255, 0, 1],
        // haloOpacity: 0.9,
        // fillOpacity: 0.2
        color: "#39ff14",
        haloOpacity: 0.9,
        fillOpacity: 0,
      },
      popup: new Popup({
        defaultPopupTemplateEnabled: true,
      }),
      // highlightOptions: {
      //   color: [255, 241, 58],
      //   fillOpacity: 0.4
      // }
    });

    await view.when();

    //add widgets
    addWidgetsNew()
      .then(([view, displayMap]) => {
        console.log(
          "Widgets Returned From Require Scope",
          view,
          displayMap,
          featureLayer
        );
        // You can work with the view object here

        //Show Attributes
        showAttributes()
          .then(([view, displayMap]) => {
            // console.log("Widgets Returned From Require Scope", view, displayMap, featureLayer);
            // You can work with the view object here
          })
          .catch((error) => {
            // Handle any errors here
          });

        // clickToDownloadScreenshot();
      })
      .catch((error) => {
        // Handle any errors here
      });

    //create layers
    createLayers(geoJSONarr)
      .then(([view, displayMap, geoJSONarr]) => {
        // console.log("featureLayers Returned From Require Scope", featureLayer);
        // You can work with the view object here
      })
      .catch((error) => {
        // Handle any errors here
      });

    return [view, displayMap, gL]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}
// calling
initializeMapPlannersWithNewFeatures()
  .then(() => {
    console.log("Map Returned From Require Scope", displayMap);
    // You can work with the view object here
  })
  .catch((error) => {
    // Handle any errors here
  });

async function addWidgetsNew() {
  try {
    // await initializeMap();

    const [
      Fullscreen,
      BasemapGallery,
      Expand,
      ScaleBar,
      AreaMeasurement2D,
      Search,
      Home,
      LayerList,
    ] = await Promise.all([
      loadModule("esri/widgets/Fullscreen"),
      loadModule("esri/widgets/BasemapGallery"),
      loadModule("esri/widgets/Expand"),
      loadModule("esri/widgets/ScaleBar"),
      loadModule("esri/widgets/AreaMeasurement2D"),
      loadModule("esri/widgets/Search"),
      loadModule("esri/widgets/Home"),
      loadModule("esri/widgets/LayerList"),
    ]);

    // var fullscreen = new Fullscreen({
    //   view: view,
    // });
    // view.ui.add(fullscreen, "top-right");

    var basemapGallery = new BasemapGallery({
      view: view,
    });

    var Expand22 = new Expand({
      view: view,
      content: basemapGallery,
      expandIcon: "basemap",
      group: "top-right",
      // expanded: false,
      expandTooltip: "معرض خريطة الأساس",
      collapseTooltip: "اغلاق",
    });
    view.ui.add([Expand22], { position: "top-right", index: 6 });

    var scalebar = new ScaleBar({
      view: view,
      unit: "metric",
    });
    view.ui.add(scalebar, "bottom-right");

    // var measurementWidget = new AreaMeasurement2D({
    //   view: view,
    // });
    // // view.ui.add(measurementWidget, "top-left")

    // var Expand4 = new Expand({
    //   view: view,
    //   content: measurementWidget,
    //   expandIcon: "measure",
    //   group: "top-right",
    //   // expanded: false,
    //   expandTooltip: "Expand to Measure",
    //   collapseTooltip: "Close Measure",
    // });
    var search = new Search({
      //Add Search widget
      view: view,
    });
    view.ui.add(search, { position: "top-left", index: 0 }); //Add to the map

    var homeWidget = new Home({
      view: view,
    });
    view.ui.add(homeWidget, "top-left");

    var layerList = new LayerList({
      view: view,
      // listItemCreatedFunction: function (event) {
      //   var item = event.item;
      //   // displays the legend for each layer list item
      //   item.panel = {
      //     content: "legend",
      //   };
      // },
      // showLegend: true
    });
    var Expand5 = new Expand({
      view: view,
      content: layerList,
      expandIcon: "layers",
      group: "top-right",
      // expanded: false,
      expandTooltip: "قائمة الطبقات",
      collapseTooltip: "اغلاق",
    });

    view.ui.add([Expand5], { position: "top-left", index: 6 });
    // view.ui.add([Expand4], { position: "top-left", index: 3 });

    // let map2 = document.getElementById("map-content");
    // view.ui.add(map2, "top-right");

    // view.ui.add("controlsWidget", "top-right");
    view.ui.add(["plans"], "top-right");
    view.ui.add(["plans2"], "top-right");
    view.ui.add(["plans3"], "top-right");
    view.ui.add(["plans4"], "top-right");
    view.ui.add(["plans5"], "top-right");
    view.ui.add(["plans6"], "top-right");
    // view.ui.add("dataContainer", "top-right");
    // view.ui.add("info", "top-right");

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

function addKMLFiles(arrayOfKMLs) {


  function htmlToNameValuePairs(htmlString) {
    const pairs = [];

    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Find all table rows in the HTML
    const rows = tempDiv.querySelectorAll("tr");

    // Iterate over each table row
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      // Check if the row has exactly two cells (name and value)
      if (cells.length === 2) {
        const name = cells[0].textContent.trim(); // Get the name (first cell content)
        const value = cells[1].textContent.trim(); // Get the value (second cell content)
        pairs.push({ name, value }); // Push name-value pair to the array
      }
    });

    return pairs;
  }

  // var file = "https://github.com/ashrafayman219/CSVV/blob/main/Plan_397.kml";
  // var file = "/Plan_909.kml";
  arrayOfKMLs.forEach((file) => {
    fetch(file)
      .then(function (response) {
        return response.text();
      })
      .then(function (xml) {
        geojson = kml(new DOMParser().parseFromString(xml, "text/xml"));
        console.log(geojson, "geojson returned")
        geoJSONarr.push(geojson);
        // console.log(geoJSONarr, "geoJSONarr");
        return geoJSONarr;
      })
      .then(function requestSucceeded() {
        // console.log(geoJSONarr, "geoJSONarr");
        geoJSONarr.forEach((geojs) => {
          for (let b = 0; b < geojs.features.length; b++) {
            if (geojs.features[b].properties.description) {
              geojs.features[b].properties.data = htmlToNameValuePairs(
                geojs.features[b].properties.description.value
              );
            }
            // console.log(data)
          }
        });
        // console.log(geoJSONarr, "finished with data");
        return geoJSONarr;
      })
      .then(function requestSucceededTwo() {
        // console.log(geoJSONarr, "finished with dataaaaaaaaaaaaaaaaa");
        geoJSONarr.forEach((l) => {
          // console.log(l, "lllllllllllllllllllll");
          l.features.forEach((feature) => {
            // Initialize an empty object to store field name and value pairs
            let fieldValues = {};
            if (feature.properties.data) {
              // Loop through each data property in the feature
              feature.properties.data.forEach((data) => {
                // Construct the field name by removing spaces and using camelCase
                let fieldName = data.name.replace(/\s+/g, "_");
                // Assign the value to the field name
                fieldValues[fieldName] = data.value;
              });
              // Assign the field name and value pairs to the properties object of the feature
              // Object.assign(feature.properties, fieldValues);
              feature.properties = fieldValues;
              // console.log(l, "yyyyyyyyyyyyyyyyyy");
            }
          });
        });
        console.log(
          geoJSONarr,
          "geoJSONarrgeoJSONarrgeoJSONarr000000000000000000"
        );
        return geoJSONarr;
      });

    // // URL reference to the blob
    // const url = URL.createObjectURL(blob);
    // // create new geojson layer using the blob url
    // const layer = new GeoJSONLayer({
    //   url
    // });
    // console.log(layer, "layerr");
    // displayMap.add(layer);

    // layer.queryFeatures().then(function(results){
    //   // prints the array of result graphics to the console
    //   console.log(results, "results.features");
    //   featureLayer = new FeatureLayer({
    //     fields: results.fields,
    //     // outFields: ["*"],
    //     objectIdField: results.fields[0].name,
    //     geometryType: results.geometryType,
    //     // spatialReference: {
    //     //   wkid: 4326
    //     // },
    //     source: results.features,
    //     // popupTemplate: popupTrailheads
    //     // renderer: citiesRenderer
    //   });
    //   console.log(featureLayer, "featureLayer");
    //   displayMap.add(featureLayer);
    // });

    /********************
          Add feature layer
        ********************/
    var citiesRenderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        size: 8,
        color: "black",
        outline: {
          // autocasts as new SimpleLineSymbol()
          width: 0.5,
          color: "white",
        },
      },
    };

    // var highlightSelect;
    // // Get the screen point from the view's click event
    // view.on("click", function (event) {
    //   var screenPoint = {
    //     x: event.x,
    //     y: event.y
    //   };
    //   // Search for graphics at the clicked location
    //   view.hitTest(screenPoint).then(function (response) {

    //       if (response.results.length) {
    //         var graphic = response.results.filter(function (result) {
    //         // check if the graphic belongs to the layer of interest
    //         // console.log(pairs, "pairs");

    //         console.log(result, "result");
    //         if (highlightSelect) {
    //           highlightSelect.remove();
    //         }
    //         return result.graphic.layer === featureLayer;
    //         })[0].graphic;

    //         // if (graphic.attributes.Parcel_ID === arcdata[y].attributes.Parcel_ID)
    //         // do something with the result graphic
    //         console.log(graphic.attributes.Parcel_ID);
    //         // console.log(arcdata[y].attributes.data);
    //         for (let y = 0; y < arcdata.length; y++) {
    //           const parcelID = arcdata[y].attributes.Parcel_ID;
    //           const htmlString = arcdata[y].attributes.description.value;
    //           // console.log(arcdata[y], "arcdata[y]");
    //           pairs = htmlToNameValuePairs(htmlString);
    //           // console.log(pairs, "pairs");
    //           // console.log(pairs, "pairs222");
    //           arcdata[y].attributes.data = pairs;
    //           // console.log(featureLayer, "featureLayer Now")
    //           if (graphic.attributes.Parcel_ID === parcelID) {
    //             console.log(parcelID, "parcelID");
    //             console.log(arcdata[y].attributes.data, "arcdata[y].attributes.data");

    //             view.whenLayerView(graphic.layer).then(function(layerView){
    //               // console.log(layerView, "layerView")
    //               if (highlightSelect) {
    //                 highlightSelect.remove();
    //               }
    //               highlightSelect = layerView.highlight(graphic);
    //             });

    //           }
    //         }
    //       }

    //   });
    // });

    // featureLayer = new FeatureLayer({
    //   fields: data.fields,
    //   outFields: ["*"],
    //   objectIdField: "Parcel_ID",
    //   geometryType: "polygon",
    //   spatialReference: {
    //     wkid: 4326
    //   },
    //   source: data.features,
    //   // popupTemplate: popupTrailheads
    //   // renderer: citiesRenderer
    // });
    // console.log(featureLayer, "featureLayer")
    // displayMap.add(featureLayer);
    // // return featureLayer;

    // console.log(collection, "collection");
    return geoJSONarr;
  });
}

async function createLayers(geojsons) {
  try {
    const [GeoJSONLayer, FeatureLayer, Query, reactiveUtils] =
      await Promise.all([
        loadModule("esri/layers/GeoJSONLayer"),
        loadModule("esri/layers/FeatureLayer"),
        loadModule("esri/rest/support/Query"),
        loadModule("esri/core/reactiveUtils"),
      ]);
    console.log(geojsons, "Finisheedddddddddddddddddd");
    // function requestSucceededThree(geojsons) {
    //   // console.log(geoJSONarr, "geoJSONarrgeoJSONarrgeoJSONarr");
    //   geojsons.forEach(ggeojson => {
    //     // create a new blob from geojson featurecollection
    //     const blob = new Blob([JSON.stringify(ggeojson)], {
    //       type: "application/json"
    //     });
    //     console.log(blob, "blob")
    //     // URL reference to the blob
    //     const url = URL.createObjectURL(blob);
    //     // create new geojson layer using the blob url
    //     const layer = new GeoJSONLayer({
    //       url
    //     });
    //     console.log(layer, "layerr");
    //     // displayMap.add(layer);
    //     layer.queryFeatures().then(function(results){
    //       // prints the array of result graphics to the console
    //       console.log(results, "results.features");
    //       featureLayer = new FeatureLayer({
    //         fields: results.fields,
    //         outFields: ["*"],
    //         objectIdField: results.fields[0].name,
    //         geometryType: results.geometryType,
    //         // spatialReference: {
    //         //   wkid: 4326
    //         // },
    //         source: results.features,
    //         // popupTemplate: popupTrailheads
    //         // renderer: citiesRenderer
    //       });
    //       console.log(featureLayer, "featureLayer");
    //       featarr.push(featureLayer);
    //       displayMap.add(featureLayer);
    //     });
    //   })

    //   return featarr;
    // }

    // featarr = requestSucceededThree(geoJSONarr)
    // console.log(featarr)



    async function createFeatureLayers(geojsons) {
      const arrayFeatures = [];
      console.log(featureLayers, "featureLayers global")
      for (const geojson of geojsons) {
        const blob = new Blob([JSON.stringify(geojson)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const geojsonLayer = new GeoJSONLayer({
          url,
        });

        await geojsonLayer.queryFeatures().then(function (results) {
          const featureLayer = new FeatureLayer({
            source: results.features,
            outFields: ["*"],
            fields: results.fields,
            objectIdField: results.fields[0].name,
            geometryType: results.geometryType,
          });
          arrayFeatures.push(featureLayer);
        });
        // console.log(arrayFeatures, "arrayFeatures");
        featureLayers = arrayFeatures;
        // console.log(featureLayers, "featureLayers");
      }
      // console.log(featureLayers, "featureLayers")
      return featureLayers;
    }


    const selectElement = document.getElementById("comparison-operator");
    // Define comparison operators
    const operators = [">", "<", "=", ">=", "<="];

    // Loop through operators and create options
    operators.forEach((operator) => {
      const option = document.createElement("option");
      option.value = operator;
      option.text = operator;
      selectElement.appendChild(option);
    });

    function isNumberKey(evt) {
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }


    
    let query = new Query();
    // const geoJSONarr = [/* Your array of GeoJSON objects */];
    // const featureLayers = createFeatureLayers(geoJSONarr);
    await createFeatureLayers(geojsons).then((featureLayers) => {
      // await createFeatureLayers(geojsons).then(featureLayers => {
      console.log(featureLayers);
      var planss = [];
      for (let i = 0; i < featureLayers.length; i++) {
        if (!planss.includes(featureLayers[i].id)) {
          planss.push(featureLayers[i].id);
          var opt = document.createElement("option");
          opt.value = featureLayers[i].id;
          opt.textContent = featureLayers[i].id;
          planselect.appendChild(opt);
        }
      }
      // })

      // console.log(featureLayers);
      // const featureLayer1 = featureLayers[0];
      // const featureLayer2 = featureLayers[1];
      // const featureLayer3 = featureLayers[2];
      // const featureLayer4 = featureLayers[3];
      // const featureLayer5 = featureLayers[4];
      // displayMap.addMany([featureLayer1, featureLayer2, featureLayer3, featureLayer4])
      // view.whenLayerView(featureLayer4).then(layerView => {
      //   view.goTo(featureLayer4.fullExtent);
      // });
    });

    // const featureLayers = await createFeatureLayers(geoJSONarr);

    planselect.addEventListener("change", function () {
      // alert(this.value)

      if (this.value == "all") {
        displayMap.removeAll();
        featureLayers.map((layer) => {
          displayMap.add(layer);
        });

        var combinedExtent = null;
        displayMap.layers.forEach(function (layer) {
          if (layer.visible) {
            var layerExtent = layer.fullExtent || layer.initialExtent;
            if (layerExtent) {
              if (combinedExtent) {
                combinedExtent = combinedExtent.union(layerExtent);
              } else {
                combinedExtent = layerExtent.clone();
              }
            }
          }
        });


        function customEasing(t) {
          return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10);
        }


        // Check if a combined extent is calculated
        if (combinedExtent) {
          // Call the goTo function to zoom to the combined extent
          view.goTo(
            {
              target: combinedExtent
            },
            {
              speedFactor: 0.3,
              easing: customEasing
            }
          )
        }
      } else {
        planselect2.style.display = "block";
        var plansss = [];
        var plansss3 = [];
        for (let i = 0; i < featureLayers.length; i++) {
          if (featureLayers[i].id === this.value) {
            displayMap.addMany([featureLayers[i]]);
            view.whenLayerView(featureLayers[i]).then((layerView) => {
              view.goTo(
                {
                  target: featureLayers[i].fullExtent,
                },
                {
                  duration: 4000,
                }
              );
            });

            // select 2
            while (planselect2.firstChild) {
              planselect2.removeChild(planselect2.firstChild);
            }
            for (let f = 0; f < featureLayers[i].fields.length; f++) {
              if (!plansss.includes(featureLayers[i].fields[f].name)) {
                plansss.push(featureLayers[i].fields[f].name);
                var opt2 = document.createElement("option");
                opt2.value = featureLayers[i].fields[f].name;
                opt2.textContent = featureLayers[i].fields[f].name;
                planselect2.appendChild(opt2);
              }
            }

            planselect2.addEventListener("change", function () {
              planselect3.style.display = "block";
              // select 3
              // alert(this.value)
              var val = this.value;
              while (planselect3.firstChild) {
                planselect3.removeChild(planselect3.firstChild);
              }
              for (let t = 0; t < featureLayers[i].source.items.length; t++) {
                Object.keys(
                  featureLayers[i].source.items[t].attributes
                ).forEach((key) => {
                  // console.log(`${key}: ${featureLayers[i].source.items[t].attributes[key]}`);
                  if (key === this.value) {
                    if (
                      !plansss3.includes(
                        featureLayers[i].source.items[t].attributes[key]
                      )
                    ) {
                      if (
                        isNaN(featureLayers[i].source.items[t].attributes[key])
                      ) {
                        plansss3.push(
                          featureLayers[i].source.items[t].attributes[key]
                        );
                        var opt3 = document.createElement("option");
                        opt3.value =
                          featureLayers[i].source.items[t].attributes[key];
                        opt3.textContent =
                          featureLayers[i].source.items[t].attributes[key];
                        planselect3.appendChild(opt3);
                      } else {
                        // display comparisonOperators select
                        planselect3.style.display = "none";
                        comparisonOperators.style.display = "block";
                        inputVal.style.display = "block";
                        buttonQuery.style.display = "block";

                        comparisonOperators.addEventListener(
                          "change",
                          function () {
                            var operators = this.value;
                            var inputreturnedVal =
                              document.getElementById("inputt").value;
                            if (inputreturnedVal) {
                              buttonQuery.addEventListener(
                                "click",
                                function () {
                                  featureLayers[i].definitionExpression =
                                    val +
                                    " " +
                                    operators +
                                    " '" +
                                    inputreturnedVal +
                                    "'";
                                }
                              );
                              // featureLayers[i].definitionExpression = val + " " + operators + " '" + this.value + "'";
                            }
                          }
                        );

                        // comparisonOperators.addEventListener("change", function() {
                        //   var operators = this.value;
                        //   inputVal.addEventListener('change', function (evt) {
                        //     if (this.value) {
                        //       buttonQuery.addEventListener("click", function() {
                        //         featureLayers[i].definitionExpression = val + " " + operators + " '" + this.value + "'";
                        //       });
                        //       // featureLayers[i].definitionExpression = val + " " + operators + " '" + this.value + "'";
                        //     }
                        //   });
                        // })
                      }
                    }
                  }
                });
              }
              console.log(this.value, "this.value");

              planselect3.addEventListener("change", function () {
                // select 3
                // alert(this.value)

                featureLayers[i].definitionExpression =
                  val + " = '" + this.value + "'";
                // featureLayers[i].queryFeatures().then(function(results){
                //   console.log(results.features);  // prints the array of features to the console
                // });
              });
            });
          }
        }
      }

      // graLayer.removeAll()
      // if (this.value == "all") {
      //     myLayer2.definitionExpression = ""
      // } else {
      //     myLayer2.definitionExpression = "CNTRY_NAME = '"+this.value+"'"
      // }
      // myLayer2.queryExtent().then(function(result){
      //     // console.log(result)
      //     view.goTo({
      //         target: result.extent,
      //         // zoom: 13
      //     }, {duration: 4500})
      // })

      // reqOpt.query.where = "CNTRY_NAME = '"+this.value+"'"

      // esriRequest(reqURL, reqOpt).then(function(result){
      //     // console.log(result.data)
      //     while(cityName.firstChild)
      //     {
      //         cityName.removeChild(cityName.firstChild)
      //     }
      //     for (let i = 0; i < result.data.features.length; i++) {

      //         var opt = document.createElement("option")
      //         opt.value = result.data.features[i].attributes.CITY_NAME
      //         opt.textContent = result.data.features[i].attributes.CITY_NAME

      //         cityName.appendChild(opt)
      //         drawChart(result.data)
      //     }
      // })
    });

    await view.when();

    return [view, displayMap]; // You can return the view object
    } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
    }
}

async function clickToDownloadScreenshot() {
  try {
    console.log("Hi in Screenshot function...");

    document
      .getElementById("takeScreenshotButton")
      .addEventListener("click", () => {
        view.takeScreenshot().then((screenshot) => {
          downloadImage("screenshot.png", screenshot.dataUrl);
        });
      });

    // helper function directly from
    // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=sceneview-screenshot
    function downloadImage(filename, dataUrl) {
      // the download is handled differently in Microsoft browsers
      // because the download attribute for <a> elements is not supported
      if (!window.navigator.msSaveOrOpenBlob) {
        // in browsers that support the download attribute
        // a link is created and a programmatic click will trigger the download
        const element = document.createElement("a");
        element.setAttribute("href", dataUrl);
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        // for MS browsers convert dataUrl to Blob
        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // download file
        window.navigator.msSaveOrOpenBlob(blob, filename);
      }
    }

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}
