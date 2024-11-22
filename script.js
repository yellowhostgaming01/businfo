document.addEventListener("DOMContentLoaded", function () {
  var last_level = -1;
  var optsData = "";
  var val = "";
  var menu = document.getElementById("dropmenu");
  var menuItems = menu.querySelectorAll("ul li");
  menuItems.forEach(function (item) {
    var source = item.textContent;
    var matches = item.querySelector("a").attributes;
    var attr = "";
    var level = source.split("_").length - 1;
    if (level > last_level) {
      val += "<ul id='sec-level'>";
    } else if (level < last_level) {
      var offset = last_level - level;
      for (var i = 0; i < offset; i++) {
        val += "</ul></li>";
      }
    }

    for (var i = 0; i < matches.length; i++) {
      let a = matches[i];
      attr += ` ${a.name}="${a.value}"`;
    }

    source = source.replace(/_/gi, "");
    val += `<li><a${attr}>`;
    for (var i = 0; i < level; i++) {
      val += "";
    }
    val += source + "</a>";
    last_level = level;
  });
  for (var i = 0; last_level >= i; i++) {
    val += "</ul>";
    if (i !== 0) {
      val += "</li>";
    }
  }
  menu.innerHTML = val;
  menu.querySelector("ul").id = "menu1";
  document.querySelectorAll("#menu1 > li > ul").forEach(function (e) {
    e.id = "sub-menu";
  });

  /*open close*/
  var openmenu = null;
  menu.querySelectorAll("li a:not(:only-child)").forEach(function (submenu) {
    submenu.addEventListener("click", () => {
      var sub = submenu.nextElementSibling;
      if (openmenu && openmenu !== sub && openmenu.id === "sec-level") {
        openmenu.style.display = "none";
      }
      if (sub.style.display === "block") {
        sub.style.display = "none";
        openmenu = null;
      } else {
        sub.style.display = "block";
        openmenu = sub;
      }
    });
  });

  _("#dropmenu li a").each(function (el) {
    _(el).on("click", function () {
      let locationAttr = _(this).attr("location");
      let location = window.location,
        path = location.pathname,
        add = location.origin;

      if (locationAttr.includes(".")) {
        // Check if a tab with the name is already open
        let openedTab = window.open("", "uniqueTabName"); // Open a tab with a unique name
        if (openedTab && !openedTab.closed) {
          // If the tab is already open, reload it
          openedTab.location.href = add + locationAttr;
          openedTab;
          openedTab.focus(); // Bring the tab to the front
        } else {
          // If no tab is open, open a new one
          window.open(add + locationAttr, "uniqueTabName");
        }
      } else {
        // Dynamically update search query in the same window
        let searchParams = new URLSearchParams(location.search);
        searchParams.set("page", locationAttr); // Update 'search' parameter with `locationAttr`
        searchParams.set("yhg", "f");
        window.location.search = searchParams.toString(); // Apply the updated query
      }
    });
  });

  // setting
  let settings = [
    {
      id: "background-color",
      label: "backgroundColor:",
      type: "text",
      type2: "color",
      value: "unset",
    },
    {
      id: "header-color",
      label: "headerColor:",
      type: "text",
      type2: "color",
      value: "unset",
    },
    {
      id: "header-background",
      label: "header Background:",
      type: "text",
      value: "unset",
      type2: "color",
    },
    {
      id: "background-image",
      type: "file",
      label: "uploadCustomBg",
      value: ``,
    },
    {
      id: "remove-background-image",
      type: "button",
      value: "remove",
      label: "remove BgImage",
    },
    {
      id: "form-label-color",
      type2: "color",
      label: "Label Color",
      value: "unset",
      type: "text",
    },
    {
      type: "select",
      options: [
        { value: "left", label: "Left" },
        { value: "right", label: "right" },
        { value: "center", label: "Center" },
      ],
      label: "Header Text Align:",
      id: "header-text-alight",
    },
    {
      id: "ff-font-family",
      label: "Font-Family",
      type: "select",
      options: [
        { value: "unset", label: "Default" },
        { value: "b612monor", label: "B612 Mono" },
        { value: "edosz", label: "Edosz" },
        { value: "greatVibesR", label: "GreatVibes" },
        { value: "grandhotelR", label: "grandhotelR" },
      ],
    },
  ];

  createSettingsPage("setting-page", "Settings", settings);
});

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
let peritem = 8;
let currentPage = 1; // To track the current page

var createPagination = function (totalPages) {
  let elt = _(".numbers").html(""); // Clear previous pagination

  for (let i = 1; i <= totalPages; i++) {
    let btn = _("<span>").text(i).attr("data-page", i); // Assign the page number as a custom attribute

    btn.on("click", function () {
      // Handle different pages based on the `page` variable
      switch (page) {
        case "bus_data":
          renderTable(i); // Call render function for bus_data
          break;
        case "cities":
          renderStop(i); // Call render function for cities
          break;
        default:
          _("#List").hide(); // Hide the list for other cases
          page = null;
          break;
      }
    });

    // Append the button to the pagination container
    elt.append(btn);
  }

  elt.find("span").each(function(f,q){
    _(f).on('click', function(){
      _(this).parent().remove()
    })
  })

  // Optionally set the first button as active on initial load
  // elt.find("span").first().addClass("active");
};

function serialize(pageType) {
  var variables = window[pageType],
    total = variables.length,
    totalPages = Math.ceil(total / peritem);

  createPagination(totalPages);

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

    if (
      pageType !== null &&
      capitalize(type.split("_data")[0]) === capitalize(pageType)
    ) {
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
      if (cities.length > 0) {
        cities.forEach((city) => {
          let elt = document.createElement("option");

          elt.value = city.name;
          elt.textContent = city.name;

          drop.appendChild(elt);
        });
      } else {
        let elt = document.createElement("option");
        elt.value = "not";
        elt.textContent = "no data";
      }
    }

    createCustomDropdown(drop);
  });
};

function renderTable(pageNumber) {
  const tbody = document.getElementById("busTable").querySelector("tbody");
  tbody.innerHTML = "";

  // page creations
  const totalItems = window[page].length;
  const totalPages = Math.ceil(totalItems / peritem);

  createPagination(totalPages);

  currentPage = pageNumber;

  const startIndex = (pageNumber - 1) * peritem;
  // const endIndex = startIndex + peritem;
  const endIndex = Math.min(startIndex + peritem, totalItems);

  // Get the buses for the current page
  const currentDatas = window[page].slice(startIndex, endIndex);

  const pageInfoText = updatePageInfo(startIndex, endIndex, totalItems);
  document.querySelector(".page-list span").textContent = pageInfoText;

  currentDatas.forEach(function (category, index) {
    var from = category.from,
      to = category.to,
      stops = category.stops,
      ft = category.timings[0],
      tt = category.timings[1],
      actualIndex = startIndex + index;

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
      editData(category, actualIndex);
    });

    const removeIcon = document.createElement("span");
    removeIcon.textContent = "❌"; // Unicode for cross
    removeIcon.classList.add("icon");
    removeIcon.addEventListener("click", () => {
      const currentLength = window[page].length;
      removeData(actualIndex);

      // Determine the total pages after removing
      const totalPages = Math.ceil((currentLength - 1) / peritem);

      // Adjust the current page if necessary
      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      renderTable(currentPage);
    });

    actionsCell.appendChild(editIcon);
    actionsCell.appendChild(removeIcon);
    actionsCell.classList.add("actions");
    row.appendChild(actionsCell);

    tbody.appendChild(row);
    serializeDropdown();
  });
}

function renderStop(pageNumber) {
  const tbody = document.getElementById("busTable").querySelector("tbody");
  tbody.innerHTML = "";

  // page creations
  const totalItems = window[page].length;
  const totalPages = Math.ceil(totalItems / peritem);

  createPagination(totalPages);

  currentPage = pageNumber;

  const startIndex = (pageNumber - 1) * peritem;
  // const endIndex = startIndex + peritem;
  const endIndex = Math.min(startIndex + peritem, totalItems);

  // Get the buses for the current page
  const currentDatas = window[page].slice(startIndex, endIndex);

  const pageInfoText = updatePageInfo(startIndex, endIndex, totalItems);
  document.querySelector(".page-list span").textContent = pageInfoText;

  currentDatas.forEach(function (data, index) {
    var name = data.name,
      code = data.code,
      actualIndex = startIndex + index;

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
        editcity(data, actualIndex);
      })
    );
    actionsCell.appendChild(
      actionTool("❌", "icon", function () {
        const currentLength = window[page].length;

        // Remove the data
        removeData(actualIndex);

        // Determine the total pages after removing
        const totalPages = Math.ceil((currentLength - 1) / peritem);

        // Adjust the current page if necessary
        if (currentPage > totalPages) {
          currentPage = totalPages;
        }

        // Render the correct page
        renderStop(currentPage);
      })
    );
    // actionsCell.classList.add("actions");
    row.appendChild(actionsCell);
    tbody.appendChild(row);
  });
}

// tools
var normalizeTimeInput = function (time) {
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
};

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

var updatePageInfo = function (startIndex, endIndex, totalItems) {
  return `Showing ${
    startIndex + 1
  } to ${endIndex} out of ${totalItems} ${page}`;
};

var serializeDropdown = function () {};

var serializePageType = function (type, options = {}) {
  type = type.split("_")[0];
  for (let key in options) {
    if (options[key] === true && typeof window[key] === "function") {
      // Call the function in the window object if the key is true and the function exists
      type = window[key](type);
    }
  }
  return type;
};

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

      const totalPages = Math.ceil(bus_data.length / peritem);
      createPagination(totalPages);
      const pageToShow = Math.ceil((index + 1) / peritem);
      renderTable(pageToShow);
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
    window[page].splice(index, 1); // Removes the property from the object

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

function editcity(yhg, index) {
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

      nameV.value = "";
      codeV.value = "";
      const totalPages = Math.ceil(cities.length / peritem);
      createPagination(totalPages);
      const pageToShow = Math.ceil((index + 1) / peritem);
      renderStop(pageToShow);
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
  // Get the current URL's query parameters
  var urlParams = new URLSearchParams(location.search);
  var searchParam = urlParams.get("page");
  page = searchParam;

  // Perform actions based on the `search` parameter value
  switch (page) {
    case "bus_data":
      renderTable(1);
      // serializeDropdown()
      _("#List").show();
      break;
    case "cities":
      renderStop(1);
      _("#List").show();
      break;
    default:
      _("#List").hide();
      page = null;
      break;
  }

  // Serialize based on the page value
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

    if (typeof pageData !== "object") {
      console.error("Invalid page data: Not an object");
      return;
    }

    // Convert the object to a JSON string
    const jsonData = JSON.stringify(pageData, null, 2); // Formatting for readability

    // Create a Blob from the JSON string
    const file = new Blob(["var " + page + "=" + jsonData], {
      type: "text/javascript",
    });

    // Generate a unique file name (or use page as the file name)
    const fileName = `${page}.js`; // Using `.json` extension for the object data

    // Create a reference in Firebase storage
    const storageRef = storage.ref(`businfoUS/${fileName}`);

    // Start uploading the file
    const uploadTask = storageRef.put(file);

    // Track upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate the progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

document.addEventListener("DOMContentLoaded", function () {
  var userFound = false;
  // Define users with their usernames and passwords
  var users = {
    "yellowhostgaming1@gmail.com": {
      UN: "Yellow Host Gaming",
      password: "businfoYHGINDIAN",
    },
  };
  let identify = localStorage.getItem("userFound");
  userFound = cheker("false", identify, undefined, false);
  // Button click event for handling form submission
  let btns = document.querySelectorAll("[clickable]");

  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let str = this.getAttribute("open").split(",");
      document.querySelector(str[0]).style.display = "block";
      document.querySelector(str[1]).style.display = "none";
    });
  });

  // Verify email button click logic
  document
    .querySelector("#verify-email")
    .addEventListener("click", function () {
      var button = this;
      var spinner = document.getElementById("loading-spinner");
      var buttonText = document.getElementById("button-text");

      spinner.style.display = "inline-block";
      buttonText.style.display = "none";
      button.disabled = true; // Disable the button to prevent multiple clicks

      setTimeout(function () {
        // After the action completes, hide the spinner and show the text
        spinner.style.display = "none";
        buttonText.style.display = "inline";
        button.disabled = false;
        validateEmail();
      }, 3000);
    });

  // Function to validate email and display the password if correct
  function validateEmail() {
    var email = document.getElementById("email").value; // Get the email input value
    var passwordSection = document.getElementById("password-section");
    var passwordElement = document.getElementById("password");
    var errorMessage = document.getElementById("error-message");

    // Check if the email is valid
    if (users[email]) {
      // If email exists in users, show the password section
      passwordSection.style.display = "block";
      passwordElement.textContent = users[email].password; // Display password
      errorMessage.style.display = "none"; // Hide error message
    } else {
      // If email doesn't exist in users, show error message and reload page
      passwordSection.style.display = "none";
      errorMessage.style.display = "block"; // Show error message
      errorMessage.textContent =
        "Invalid email address. Please check your Gmail address."; // Customize the error message

      // Reload the page and show an alert
      setTimeout(function () {
        alert("Beta ja ke apni info leke aa");
        location.reload(); // Refresh the page
      }, 2000); // Wait for 2 seconds before refreshing
    }
  }

  // Handle the login form submission
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check if the entered username and password match any user
    for (var email in users) {
      if (users[email].UN === username && users[email].password === password) {
        userFound = true;
        localStorage.setItem("userFound", "true");
        break;
      }
    }

    if (!userFound) {
      alert("Invalid username or password.");
      // Refresh the page if login fails
      localStorage.setItem("userFound", "false");
      setTimeout(function () {
        location.reload(); // Refresh the page
      }, 2000); // Wait for 2 seconds before refreshing
    } else {
      _(".yhg-login").remove();
    }
  });

  if (userFound) {
    _(".yhg-login").remove();
  }
});
