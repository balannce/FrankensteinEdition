// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = `../xml/${tei_xml}.xml`;
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      manifestId: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");
      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
  function selectHand(event) {
  var visible_mary = document.getElementsByClassName('#MWS');
  var visible_percy = document.getElementsByClassName('#PBS');
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
    if (event.target.value == 'both') {
    //write an forEach() method that shows all the text written and modified by both hand (in black?). The forEach() method of Array instances executes a provided function once for each array element.
      MaryArray.forEach(el => el.style.backgroundColor = 'rgb(201, 229, 215)');
      PercyArray.forEach(el => el.style.backgroundColor = 'rgb(201, 229, 215)');
    } else if (event.target.value == 'Mary') {
     //write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
       MaryArray.forEach(el => el.style.backgroundColor = 'White');
       PercyArray.forEach(el => el.style.backgroundColor = 'rgb(201, 229, 215)');
    } else if (event.target.value == "Percy") {
     //write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
      MaryArray.forEach(el => el.style.backgroundColor = 'rgb(201, 229, 215)');
      PercyArray.forEach(el => el.style.backgroundColor = 'White');
    }
  }
// write another function that will toggle the display of the deletions by clicking on a button
let delVisible = true;
document.getElementById("toggle-del").addEventListener('click', function() {
  const deletions = document.querySelectorAll('del');
  deletions.forEach(el => {
    el.style.display = delVisible ? "none" : "";
  });
  delVisible = !delVisible;
});
// function that will toggle the display of the additions by clicking on a button
let addVisible = true;
document.getElementById("toggle-add").addEventListener('click', function() {
  const additions = document.querySelectorAll("add");
  additions.forEach(el => {
    el.style.display = addVisible ? 'none':"";
  });
  addVisible = !addVisible;
});

// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)
let readMode = true;
document.getElementById("toggle-readmode").addEventListener('click', function() {
  const additions = document.querySelectorAll("add");
  const deletions = document.querySelectorAll("del");
  const metamarks = document.querySelectorAll("metamark");
  additions.forEach(el => {
    el.style.cssText = readMode ? "font-size: medium; vertical-align: baseline; display: inline;" : "";
  });
  deletions.forEach(el => {
    el.style.display = readMode ? "none" : "";
  });
  metamarks.forEach(el => {
    el.style.display = readMode ? "none" : "";
  });
  readMode = !readMode;
});