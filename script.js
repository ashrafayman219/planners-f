// import { kml } from "https://unpkg.com/@tmcw/togeojson?module";

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

let geojsons = [
  "https://raw.githubusercontent.com/ashrafayman219/planners-f/main/Plan909.geojson",
  "https://raw.githubusercontent.com/ashrafayman219/planners-f/main/Plan734.geojson"
];

// let geoJSONarr = [];
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

    displayMap = new Map({
      // basemap: "dark-gray-vector",
      basemap: "dark-gray-vector",
      // layers: [layer],
    });

    view = new MapView({
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
    createLayers(geojsons)
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

async function createLayers(geojsons) {
  try {
    const [GeoJSONLayer, FeatureLayer, Query, reactiveUtils, Legend] =
      await Promise.all([
        loadModule("esri/layers/GeoJSONLayer"),
        loadModule("esri/layers/FeatureLayer"),
        loadModule("esri/rest/support/Query"),
        loadModule("esri/core/reactiveUtils"),
        loadModule("esri/widgets/Legend"),
      ]);

      const region7 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#8t2590",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };

      const region6 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#7f89a1",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };
  
      const region5 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#99977F",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };
  
      const region4 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#fffcd4",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };
  
      const region3 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#b1cdc2",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };
  
      const region2 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#38627a",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };
  
      const region1 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#0d2644",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };
  
      const renderer = {
        type: "unique-value", // autocasts as new ClassBreaksRenderer()
        field: "إستخدام_الأرض",
        // normalizationField: "EDUCBASECY",
        legendOptions: {
          title: "by land use classification",
        },
        // defaultSymbol: {
        //   type: "simple-fill", // autocasts as new SimpleFillSymbol()
        //   color: "#38689a",
        //   style: "solid",
        //   outline: {
        //     width: 0.2,
        //     color: [255, 255, 255, 0.5],
        //   },
        // },
        // defaultLabel: "لا يوجد",
        uniqueValueInfos: [
          {
            value: "سكني",
            symbol: region1,
            label: "سكني",
          },
          {
            value: "ديني",
            symbol: region2,
            label: "ديني",
          },
          {
            value: "تجاري",
            symbol: region3,
            label: "تجاري",
          },
          {
            value: "حكومي",
            symbol: region4,
            label: "حكومي",
          },
          {
            value: "تعليمي",
            symbol: region5,
            label: "تعليمي",
          },
          {
            value: "استثماري",
            symbol: region6,
            label: "استثماري",
          },
          {
            value: "مرافق عامة",
            symbol: region7,
            label: "مرافق عامة",
          },
        ],
      };


      let legend = new Legend({
        view: view,
        // layerInfos: [
        //   {
        //     layer: District1_Neighborhoods,
        //     title: "Region 1"
        //   },
        //   {
        //     layer: District2_Neighborhoods,
        //     title: "Region 2"
        //   },
        // ]
      });
      legend.headingLevel = 2;
      legend.style = {
        type: "card",
        layout: "stack",
      };
      legend.basemapLegendVisible = true;
      legend.hideLayersNotInCurrentView = true;
      view.ui.add(legend, "bottom-left");

    async function createFeatureLayers(geojsons) {
      const arrayFeatures = [];
      for (const geojsonURL of geojsons) {
        const parsedUrl = new URL(geojsonURL);
        const pathname = parsedUrl.pathname;
        const pathParts = pathname.split('/');
        const filenameWithExtension = pathParts[pathParts.length - 1];
        const title = filenameWithExtension.split('.')[0];

        const geojsonLayer = new GeoJSONLayer({
          url: geojsonURL,
          title: title
        });
        await geojsonLayer.queryFeatures().then(function (results) {
          console.log(results)
          const featureLayer = new FeatureLayer({
            source: results.features,
            outFields: ["*"],
            fields: results.fields,
            objectIdField: results.fields[0].name,
            geometryType: results.geometryType,
            title: geojsonLayer.title,
            renderer: renderer
          });
          arrayFeatures.push(featureLayer);
        });
        featureLayers = arrayFeatures;
      }
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
    await createFeatureLayers(geojsons).then((featureLayers) => {
      console.log(featureLayers);
      var planss = [];
      for (let i = 0; i < featureLayers.length; i++) {
        if (!planss.includes(featureLayers[i].title)) {
          planss.push(featureLayers[i].title);
          var opt = document.createElement("option");
          opt.value = featureLayers[i].title;
          opt.textContent = featureLayers[i].title;
          planselect.appendChild(opt);
        }
      }

    });

    planselect.addEventListener("change", function () {
      view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
          if (response.results.length) {
            let graphic = response.results.filter(function (result) {
              
              for (const layerName of featureLayers) {
                if (result.graphic.layer === layerName) {
                  return (
                    result.graphic.layer === layerName
                  );
                }
              }
            })[0].graphic;
            view.goTo(
              {
                target: graphic,
              },
              {
                duration: 2500,
              }
            );
          }
        });
      });

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


        // function customEasing(t) {
        //   return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10);
        // }


        // Check if a combined extent is calculated
        if (combinedExtent) {
          // Call the goTo function to zoom to the combined extent
          view.goTo(
            {
              target: combinedExtent
            },
            {
              duration: 3000,
              speedFactor: 0.8,
              easing: "in-out-coast-quadratic"
            }
          )
        }
      } else {
        planselect2.style.display = "block";
        var plansss = [];
        var plansss3 = [];
        for (let i = 0; i < featureLayers.length; i++) {
          if (featureLayers[i].title === this.value) {
            displayMap.addMany([featureLayers[i]]);
            view.whenLayerView(featureLayers[i]).then((layerView) => {
              view.goTo(
                {
                  target: featureLayers[i].fullExtent,
                },
                {
                  duration: 3000,
                  speedFactor: 0.3,
                  easing: "in-out-coast-quadratic"
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
                            }
                          }
                        );
                      }
                    }
                  }
                });
              }
              console.log(this.value, "this.value");
              planselect3.addEventListener("change", function () {
                featureLayers[i].definitionExpression =
                  val + " = '" + this.value + "'";
              });
            });
          }
        }
      }
    });

    await view.when();

    return [view, displayMap]; // You can return the view object
    } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
    }
}

// async function clickToDownloadScreenshot() {
//   try {
//     console.log("Hi in Screenshot function...");

//     document
//       .getElementById("takeScreenshotButton")
//       .addEventListener("click", () => {
//         view.takeScreenshot().then((screenshot) => {
//           downloadImage("screenshot.png", screenshot.dataUrl);
//         });
//       });

//     // helper function directly from
//     // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=sceneview-screenshot
//     function downloadImage(filename, dataUrl) {
//       // the download is handled differently in Microsoft browsers
//       // because the download attribute for <a> elements is not supported
//       if (!window.navigator.msSaveOrOpenBlob) {
//         // in browsers that support the download attribute
//         // a link is created and a programmatic click will trigger the download
//         const element = document.createElement("a");
//         element.setAttribute("href", dataUrl);
//         element.setAttribute("download", filename);
//         element.style.display = "none";
//         document.body.appendChild(element);
//         element.click();
//         document.body.removeChild(element);
//       } else {
//         // for MS browsers convert dataUrl to Blob
//         const byteString = atob(dataUrl.split(",")[1]);
//         const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
//         const ab = new ArrayBuffer(byteString.length);
//         const ia = new Uint8Array(ab);
//         for (let i = 0; i < byteString.length; i++) {
//           ia[i] = byteString.charCodeAt(i);
//         }
//         const blob = new Blob([ab], { type: mimeString });

//         // download file
//         window.navigator.msSaveOrOpenBlob(blob, filename);
//       }
//     }

//     await view.when();

//     return [view, displayMap]; // You can return the view object
//   } catch (error) {
//     console.error("Error initializing map:", error);
//     throw error; // Rethrow the error to handle it further, if needed
//   }
// }
