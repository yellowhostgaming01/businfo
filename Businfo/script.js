var elt = function (tag) {
  return document.createElement(tag);
};

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
    fromV: document.querySelector(".yhg #from").value,
    toV: document.querySelector(".yhg #to").value,
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
    fromV: document.querySelector(".yhg #from").value,
    toV: document.querySelector(".yhg #to").value,
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
  fromV.value = from;
  var toV = document.querySelector(".yhg #to");
  toV.value = to;
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
    fromV.value = currentTest.fromV;
    toV.value = currentTest.toV;
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
      data.from = capitalize(fromV.value);
      data.to = capitalize(toV.value);
      data.stops = stopsArr;
      data.timings = TIV.value
        .split(",")
        .map((time) => normalizeTimeInput(time.trim()));
      data.route = capitalize(RV.value);
      data.handler = capitalize(HV.value);

      document.getElementById("editFormContainer").style.display = "none";
      fromV.value = "";
      toV.value = "";
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
  delete bus_data[index];
};

renderTable();

function addData() {
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
  currentAdd = length
  editData(bus_data[length], length);
}

document.ready(function () {
  _("#closeEditForm").on("click", function () {
    _(this).parent().parent().hide();
    window[_(this).attr("currentType")] = null;

    if (currentAdd) {
      bus_data.splice(bus_data[currentAdd], 1)
      currentAdd = null
    }
  });

  let addDataButton = document.getElementById("addDataButton");

  addDataButton.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("editFormContainer").style.display = "block";
    addData();
  });
});
