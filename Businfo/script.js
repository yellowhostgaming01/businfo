var currentEdit = null;
let currentTest = null;
var currentEditS = null;
let currentAdd = null;
let fillersElt = {
  fromV: document.querySelector(".yhg #from"),
  toV: document.querySelector(".yhg #to"),
  TIV: document.querySelector(".yhg #timing"),
  VV: document.querySelector(".yhg #vendor"),
  HV: document.querySelector(".yhg #depo"),
  RV: document.querySelector(".yhg #route"),
};
let page = null;

function serialize(pageType) {
  if (pageType.split("_data")) {
    pageType = pageType.split("_data")[0];
  }

  _("#addDataButton").attr("open", capitalize(pageType));

  // elements
  var headingList = document.querySelector("#List h2 span");
  headingList.innerHTML = cheker("All", capitalize(pageType), null);

  Object.keys(list).forEach(function (type, index) {
    var data = list[type],
      thead = data.thead;

    if (pageType !== null && capitalize(type.split("_data")[0]) === capitalize(pageType)) {
      serializeEDITADDform(data);
      headingList.parentElement.parentElement
        .querySelector("thead")
        .appendChild(listMaker(thead, "th", "tr"));
    }
  });

  
}

var serializeEDITADDform = function (data) {
  let parent = document.querySelector("#busForm .yhg");
  parent.innerHTML = data.editForm[0];

  var dropdown = document.querySelectorAll(".dropdown");


  dropdown.forEach(function (drop) {
    let dropAttr = drop.getAttribute("data-type");
    if (dropAttr == "stops") {
      if(cities.length > 0) {
        cities.forEach((city) => {
          let elt = document.createElement("option");
  
          elt.value = city.name;
          elt.textContent = city.name;
  
          drop.appendChild(elt);
        });
      } else {
        let elt = document.createElement("option");
  
          elt.value = 'not';
          elt.textContent = 'no data';
      }
    }
    
    createCustomDropdown(drop);
  });
};

function renderTable() {
  const tbody = document.getElementById("busTable").querySelector("tbody");
  tbody.innerHTML = "";

  bus_data.forEach(function (category, index) {
    var from = category.from,
      to = category.to,
      stops = category.stops,
      ft = category.timings[0],
      tt = category.timings[1];

    const row = document.createElement("tr");
    const vendorCell = document.createElement("td");
    vendorCell.innerHTML = cheker("!Available", category.vendor, "", undefined);
    row.appendChild(vendorCell);
    const fromCell = document.createElement("td");
    fromCell.innerHTML = from;
    row.appendChild(fromCell);

    const toCell = document.createElement("td");
    toCell.innerHTML = to;
    row.appendChild(toCell);

    const stopsCell = document.createElement("td");
    stopsCell.innerHTML = "...";
    row.appendChild(stopsCell);

    const timingsCell = document.createElement("td");
    timingsCell.innerHTML = "...";
    row.appendChild(timingsCell);

    const routeCell = document.createElement("td");
    routeCell.innerHTML = cheker("!Available", category.route, undefined, "");
    row.appendChild(routeCell);

    const depoCell = document.createElement("td");
    depoCell.innerHTML = cheker("!Available", category.handler, undefined, "");
    row.appendChild(depoCell);

    const actionsCell = document.createElement("td");
    const editIcon = document.createElement("span");
    editIcon.textContent = "✏️"; // Unicode for pencil
    editIcon.classList.add("icon");
    editIcon.addEventListener("click", () => {
      document.getElementById("editFormContainer").style.display = "block";
      currentEdit = null;
      editData(category, index);
    });

    const removeIcon = document.createElement("span");
    removeIcon.textContent = "❌"; // Unicode for cross
    removeIcon.classList.add("icon");
    removeIcon.addEventListener("click", () => {
      removeData(index);
      renderTable();
    });

    actionsCell.appendChild(editIcon);
    actionsCell.appendChild(removeIcon);
    actionsCell.classList.add("actions");
    row.appendChild(actionsCell);

    tbody.appendChild(row);
    serializeDropdown();
  });
}

function renderStop() {
  const tbody = document.getElementById("busTable").querySelector("tbody");
  tbody.innerHTML = "";

  cities.forEach(function (data, index) {
    var name = data.name,
      code = data.code;

    const row = document.createElement("tr");

    let nameCell = document.createElement("td");
    nameCell.innerHTML = cheker("!Available", name, "");
    row.appendChild(nameCell);

    let codeCell = document.createElement("td");
    codeCell.innerHTML = cheker("!Available", code, "");
    row.appendChild(codeCell);

    let actionsCell = document.createElement("td");
    actionsCell.classList.add("actions");
    actionsCell.appendChild(
      actionTool("✏️", "icon", function () {
        document.getElementById("editFormContainer").style.display = "block";
        editcity(data, index);
      })
    );
    actionsCell.appendChild(
      actionTool("❌", "icon", function () {
        removeData(index);
        renderStop();
      })
    );
    // actionsCell.classList.add("actions");
    row.appendChild(actionsCell);
    tbody.appendChild(row);
  });
}

// tools
function normalizeTimeInput(time) {
  // Default to 8:00 am if no time is provided
  if (!time) return "08:00 am";

  // Add logic for single number inputs (e.g., "10" becomes "10:00")
  const singleHourMatch = time.match(/^(\d{1,2})$/);
  if (singleHourMatch) {
    time = `${singleHourMatch[1]}:00`;
  }

  // Regex to extract hours, minutes, and period if present
  const match = time.match(/(\d{1,2}):(\d{1,2})(?:\s*(am|pm))?/i);
  if (!match) return "08:00 am"; // Return a default valid time if parsing fails

  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Format minutes with leading zero if needed
  minutes = String(minutes).padStart(2, "0");

  // Determine if the time is in the 24-hour format and convert if needed
  if (!period) {
    period = hours < 12 ? "am" : "pm";
    if (hours > 12) hours -= 12;
    else if (hours === 0) hours = 12; // Midnight case
  } else {
    period = period.toLowerCase();
  }

  // Ensure hours are formatted as two digits
  hours = String(hours).padStart(2, "0");

  return `${hours}:${minutes} ${period}`;
}

var capitalize = function (str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
};

var cheker = function (replacer, str, ...finders) {
  for (const finder of finders) {
    if (str === finder) return replacer;
  }

  return str;
};

var listMaker = function (data, tag, appendableTag) {
  let at = document.createElement(appendableTag);
  data.forEach(function (data) {
    let elt = document.createElement(tag);
    elt.textContent = data;

    at.appendChild(elt);
  });

  return at;
};

var editFormMaker = function (data, tag, appendableTag) {};

var actionTool = function (textContent, classN, callback, tag) {
  let elt = document.createElement(cheker("span", tag, "", undefined));
  elt.innerHTML = textContent;
  elt.addEventListener("click", callback);
  elt.classList.add(classN);

  return elt;
};

var serializeDropdown = function () {};

function addEditStops(stop, index) {
  const stpNElt = document.getElementById("stopName-sdsh"),
    timingsElt = document.getElementById("timing-sdsh"),
    distanceElt = document.getElementById("distnace-sdsh");

  // Reset form if editing a new stop
  if (currentEditS) {
    const { oldCategory } = currentEditS;
    stpNElt.value = oldCategory.name;
    timingsElt.value = `${oldCategory.timings[0]}, ${oldCategory.timings[1]}`;
    distanceElt.value = oldCategory.distance;
  } else {
    stpNElt.value = "";
    timingsElt.value = "";
    distanceElt.value = "";
  }

  currentTest = {
    fromV: document.querySelector(".yhg #from").textContent,
    toV: document.querySelector(".yhg #to").textContent,
    tiv: document.querySelector(".yhg #timing").value,
    vv: document.querySelector(".yhg #vendor").value,
    HV: document.querySelector(".yhg #depo").value,
    RV: document.querySelector(".yhg #route").value,
  };

  // Remove existing event listener to avoid duplicates
  document
    .getElementById("addsdBTN")
    .replaceWith(document.getElementById("addsdBTN").cloneNode(true));

  document.getElementById("addsdBTN").addEventListener("click", function (e) {
    e.preventDefault();

    if (currentEdit) {
      currentEdit.stopsArr[index] = {};
      if (currentEditS) {
        currentEdit.stopsArr[index].name = stpNElt.value;
        currentEdit.stopsArr[index].timings = timingsElt.value
          .split(",")
          .map((time) => normalizeTimeInput(time.trim()));
        currentEdit.stopsArr[index].distance = distanceElt.value;
      } else {
        const category = currentEdit.oldCategory;
        const stops = category.stops;

        currentEdit.stopsArr.push({
          name: stpNElt.value,
          timings: timingsElt.value
            .split(",")
            .map((time) => normalizeTimeInput(time.trim())),
          distance: distanceElt.value,
        });
      }
      editData(currentEdit.oldCategory, currentEdit.index);
    }

    currentEditS = null;
    _("#addsdata").hide();
  });

  _("#addsdata").show();
}

function removeStop(index) {
  delete currentEdit.stopsArr[index];
  currentTest = {
    fromV: document.querySelector(".yhg #from").textContent,
    toV: document.querySelector(".yhg #to").textContent,
    tiv: document.querySelector(".yhg #timing").value,
    vv: document.querySelector(".yhg #vendor").value,
    HV: document.querySelector(".yhg #depo").value,
    RV: document.querySelector(".yhg #route").value,
  };
  editData(currentEdit.oldCategory, currentEdit.index);
}

function editData(bus, index) {
  var data = bus_data[index];
  var from = data.from,
    to = data.to,
    ft = data.timings[0],
    tt = data.timings[1],
    stops = data.stops,
    vendor = data.vendor,
    handler = data.handler,
    route = data.route;

  var stopsArr = [];

  var fromV = document.querySelector(".yhg #from");
  fromV.innerHTML = cheker("Select a City...", from, "");
  var toV = document.querySelector(".yhg #to");
  toV.textContent = cheker("Select a City...", to, "");
  var TIV = document.querySelector(".yhg #timing");
  TIV.value = ft + ", " + tt;
  var VV = document.querySelector(".yhg #vendor");
  VV.value = vendor;
  var HV = document.querySelector(".yhg #depo");
  HV.value = handler;
  var RV = document.querySelector(".yhg #route");
  RV.value = route;
  var parent = _(".dropdownlists").html("");

  if (currentTest) {
    fromV.innerHTML = currentTest.fromV;
    toV.innerHTML = currentTest.toV;
    TIV.value = currentTest.tiv;
    VV.value = currentTest.vv;
    HV.value = currentTest.HV;
    RV.value = currentTest.RV;
    currentTest = null;
  }

  if (currentEdit) {
    stopsArr = currentEdit.stopsArr;
  } else {
    stopsArr = stops;
  }

  stopsArr.forEach(function (stop, index) {
    var main = _("<div>")
      .addClass("shsd-every")
      .append(_("<div>").html(`Name:- <span>${stop.name}</span>`))
      .append(_("<br>"))
      .append(_("<div>").html(`Arrival:- <span>${stop.timings[0]}</span>`))
      .append(_("<br>"))
      .append(_("<div>").html(`Departure:- <span>${stop.timings[1]}</span>`))
      .append(_("<br>"))
      .append(
        _("<div>")
          .addClass("actions-sdshe")
          .append(
            _("<span>")
              .append(_("<i>").addClass("yhgi yhgi-pencil-24"))
              .on("click", function () {
                currentEditS = { oldCategory: stop, index };
                addEditStops(stop, index);
              })
          )
          .append(
            _("<span>")
              .append(_("<i>").addClass("yhgi yhgi-trash-24"))
              .on("click", function () {
                removeStop(index);
              })
          )
      );

    parent.append(main);
  });

  document
    .querySelector(".stops-handler-main .shssi button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      addEditStops();
    });

  document
    .getElementById("pushDataButton")
    .replaceWith(document.getElementById("pushDataButton").cloneNode(true));

  _("#pushDataButton").on("click", function () {
    if (currentEdit) {
      data.vendor = capitalize(VV.value);
      data.from = capitalize(fromV.textContent);
      data.to = capitalize(toV.textContent);
      data.stops = stopsArr;
      data.timings = TIV.value
        .split(",")
        .map((time) => normalizeTimeInput(time.trim()));
      data.route = capitalize(RV.value);
      data.handler = capitalize(HV.value);

      document.getElementById("editFormContainer").style.display = "none";
      fromV.textContent = "";
      toV.textContent = "";
      TIV.value = "";
      VV.value = "";
      HV.value = "";
      RV.value = "";
      _(".dropdownlists").html("");
      renderTable();
    }

    currentEdit = null;
    currentAdd = null;
  });

  currentEdit = {
    oldCategory: bus,
    index,
    stopsArr: stopsArr,
  };
}

var removeData = function (index) {
  // Ensure that the page and index are valid before deleting
  if (window[page] && window[page].hasOwnProperty(index)) {
    window[page].splice(index, 1) // Removes the property from the object
    console.log(`Property at index ${index} has been removed.`);
  } else {
    console.log(`Property at index ${index} not found or page does not exist.`);
  }
};


// bus
function addBus() {
  var length = bus_data.length;
  bus_data.push({
    vendor: "",
    from: "",
    to: "",
    timings: [],
    stops: [],
    route: "",
    handler: "",
  });
  currentAdd = length;
  editData(bus_data[length], length);
}

function editcity(city, index) {
  var data = cities[index];
  var name = data.name,
    code = data.code;

  var nameV = document.getElementById("cityname"),
    codeV = document.getElementById("citycode");

  nameV.value = name;
  codeV.value = code;

  document
    .getElementById("pushDataButton")
    .replaceWith(document.getElementById("pushDataButton").cloneNode(true));

  document
    .getElementById("pushDataButton")
    .addEventListener("click", function () {
      data.name = capitalize(nameV.value);
      data.code = capitalize(codeV.value);
      document.getElementById("editFormContainer").style.display = "none";
      renderStop();
      nameV.value = "";
      codeV.value = "";
    });
}

function addCities() {
  var length = cities.length;
  cities.push({
    name: "",
    code: "",
  });
  currentAdd = length;
  editcity(cities[length], length);
}

// urls setup
document.ready(function () {
  var pathnmae = location.href;
  var splits = pathnmae.split("?page=")[1];
  page = splits;
  switch (splits) {
    case "bus_data":
      renderTable();
      // serializeDropdown()
      _("#List").show();
      break;
    case "cities":
      renderStop();
      _("#List").show();
      break;
    default:
      _("#List").hide();
      page = null;
      break;
  }

  serialize(page);
});
document.ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDXwgdo0zLt4QpBt9X-V1R4c8FkOBen-t4",
    authDomain: "wsmfus.firebaseapp.com",
    projectId: "wsmfus",
    storageBucket: "wsmfus.appspot.com",
    messagingSenderId: "757303413386",
    appId: "1:757303413386:web:22e3248b5e2be40d3b7b73",
    measurementId: "G-JQ3YNJX1TY",
  };
  const app = firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();

  _("#closeEditForm").on("click", function () {
    _(this).parent().parent().hide();
    window[_(this).attr("currentType")] = null;

    if (currentAdd) {
      window[page].splice(window[page][currentAdd], 1);
      currentAdd = null;
    }
  });

  let addDataButton = document.getElementById("addDataButton");
  let saveDataButton = document.getElementById("saveChanges");

  saveDataButton.addEventListener("click", function () {
    // Get the object from window[page]
    const pageData = window[page];
  
    if (typeof pageData !== 'object') {
      console.error("Invalid page data: Not an object");
      return;
    }
  
    // Convert the object to a JSON string
    const jsonData = JSON.stringify(pageData, null, 2); // Formatting for readability
  
    // Create a Blob from the JSON string
    const file = new Blob(["var " + page + "=" + jsonData], { type: "text/javascript" });
  
    // Generate a unique file name (or use page as the file name)
    const fileName = `${page}.js`;  // Using `.json` extension for the object data
  
    // Create a reference in Firebase storage
    const storageRef = storage.ref(`businfoUS/${fileName}`);
  
    // Start uploading the file
    const uploadTask = storageRef.put(file);
  
    // Track upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate the progress percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error during upload:", error);
      },
      async () => {
        // Upload completed successfully
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log("File uploaded successfully. Download URL:", downloadURL);
      }
    );
  });
  

  _(addDataButton).on("click", function (e) {
    e.preventDefault();
    document.getElementById("editFormContainer").style.display = "block";
    window["add" + _(this).attr("open")]();
  });

  
});

document.getElementById("saveChanges").addEventListener("click", function () {
  // bus_data"
});
