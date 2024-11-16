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
        // submenu.classList.remove("mactive");
        openmenu = null;
      } else {
        sub.style.display = "block";
        // submenu.classList.add("mactive");
        openmenu = sub;
      }
    });
  });

  _("#dropmenu li a").each(function (el) {
    _(el).on("click", function () {
      let windowurl = _(this).attr("open-window");
      _(`#${windowurl}`).css({ display: "block" });
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

var opensearch = false;

function openSearch() {
  document.getElementById("search-box").style.right = "0";
  opensearch = true;
}

function closeSearch() {
  document.getElementById("search-box").style.right = "-100%";
  opensearch = false;
}

document.addEventListener("DOMContentLoaded", function () {
  var menuIcon = document.querySelector(".menu-icon");
  var menuClose = document.querySelector("span.menu-close");
  var menu = document.getElementById("LinkList3");

  // Click event listener for opening the menu
  menuIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent body click event
    menu.style.left = "0";
    if (opensearch) {
      document.getElementById("search-box").style.right = "-100%";
    }
  });

  // Click event listener for closing the menu
  menuClose.addEventListener("click", function (event) {
    event.stopPropagation();
    menu.style.left = "-500px";
    if (opensearch) {
      document.getElementById("search-box").style.right = "0";
    }
  });

  document.body.addEventListener("click", function (event) {
    if (menu.style.left === "0px" && !menu.contains(event.target)) {
      menu.style.left = "-500px";
      if (opensearch) {
        document.getElementById("search-box").style.right = "0";
      }
    }
  });
});

/*global*/

/*handlers*/
var handlerSC = function (parentelt) {
  parentelt.find("div.suggestions-main-scd").each(function (elt) {
    elt.addEventListener("click", function () {
      remove_content("search-cities-main-container");
      let appendant = _(elt).attr("appendant"),
        appendantelt = _("." + appendant);

      appendantelt.find("span").html(_(elt).attr("name"));
    });
  });

  var inputElt = _(".input-sc-header input");

  inputElt.on("keyup", function () {
    var input = this.value.toLowerCase(); // Input ko lower case mein convert kiya
    parentelt.find("div.suggestions-main-scd").each(function () {
      var attr = this.getAttribute("name").toLowerCase(); // Attribute ko lower case mein convert kiya

      // Agar input ke andar jo likha hai, vo attr ke andar ka koi part hai (partial match)
      if (attr.indexOf(input) !== -1) {
        _(this).show(); // Match hone par element show karo
      } else {
        _(this).hide(); // Agar match nahi hai to hide karo
      }
    });
  });
};

var handlerSB = function (parentelt) {
  parentelt.find("div.select-cities").each(function (elt) {
    elt.addEventListener("click", function () {
      select_cities(this.getAttribute("name"));
    });
  });

  parentelt.find("div.form-sb-exchange-btn").on("click", function () {
    var a = parentelt.find(".usr-data-sb-to span");
    var b = parentelt.find(".usr-data-sb-from span");
    var at = a.text(),
      bt = b.text();

    a.text(bt);
    b.text(at);
  });
};

var search_handler = function (from, to) {
  var tf = {};
  var results = bus_data.filter(function (bus) {
    // Compare using a case-insensitive method
    var fromMatches =
      capitalize(bus.from) === capitalize(from) ||
      bus.stops.some((stop) => capitalize(stop.name) === capitalize(from));
    var toMatches =
      capitalize(bus.to) === capitalize(to) ||
      bus.stops.some((stop) => capitalize(stop.name) === capitalize(to));
    return fromMatches && toMatches;
  });
  tf = { from: capitalize(from), to: capitalize(to) };
  result_data(results, tf);
};

var info_handler = function (usrft, bus) {
  bus_info_ui();

  var from = bus.from,
    ft = bus.timings[0],
    to = bus.to,
    tot = bus.timings[1],
    stops = bus.stops,
    dis = "0";

  var tbody = _(".table-data-bi tbody");
  var fromdata = _("<tr>"),
    todata = _("<tr>");

  if (usrft.from === from) {
    fromdata.addClass("usrActive");
  }

  fromdata
    .append(_("<td>").text(from))
    .append(_("<td>").text("Starting"))
    .append(_("<td>").text(ft))
    .append(_("<td>").text(dis));

  tbody.append(fromdata);

  stops.forEach(function (stop) {
    var name = stop.name,
      atime = stop.timings[0],
      dtime = stop.timings[1];
    var stopData = _("<tr>");

    if (usrft.to === name || usrft.from === name) {
      stopData.addClass("usrActive");
    }

    stopData
      .append(_("<td>").text(name))
      .append(_("<td>").text(atime))
      .append(_("<td>").text(dtime))
      .append(_("<td>").text(dis));

    tbody.append(stopData);
  });

  if (usrft.to === to) {
    todata.addClass("usrActive");
  }

  todata
    .append(_("<td>").text(to))
    .append(_("<td>").text(tot))
    .append(_("<td>").text("End"))
    .append(_("<td>").text(dis));

  tbody.append(todata);
};

var capitalize = function (str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
};

/*back btn*/
var remove_content = function (className) {
  _("." + className).remove();
};

var back_system = function () {
  _(".back-yhgi").each(function () {
    _(this).on("click", function () {
      if (_(this).attr("last") === "true") {
        _(".tabs-main-table").show();
      }
      remove_content(_(this).attr("parent"));
    });
  });
};

var select_cities = function (appendant) {
  var main = _("<div>").attr({
    class: "search-cities-main-container",
  });
  var header = _("<div>")
    .attr("class", "sc-header")
    .append(
      _("<div>")
        .attr({
          class: "back-sc-header back-yhgi",
          parent: "search-cities-main-container",
        })
        .append(_("<i>").addClass("fa fa-arrow-left"))
    )
    .append(
      _("<div>")
        .addClass("input-sc-header")
        .append(
          _("<input>").attr({
            type: "text",
            placeholder: "Search cities...",
          })
        )
    )
    .append(
      _("<div>")
        .addClass("cross-sc-header")
        .append(
          _("<i>")
            .addClass("opf opf-clear")
            .on("click", function () {
              _(this).parent().prev().find("input").val("");
            })
        )
    );

  var dropdownC = _("<div>").addClass("sc-content-dropdown");

  cities.forEach(function (object) {
    let name = capitalize(object.name),
      code = object.code.toUpperCase();

    let cc = _("<div>").addClass("city-code-scd").html(code);
    let cn = _("<div>").addClass("city-name-scd").html(name);
    let main = _("<div>")
      .addClass("suggestions-main-scd")
      .append(cc)
      .append(cn)
      .attr({
        appendant: appendant,
        name: name,
        code: code,
      });
    dropdownC.append(main);
  });

  main
    .append(header)
    .append(
      _("<div>")
        .addClass("sc-content-type")
        .append(_("<span>").text("Suggestions"))
    )
    .append(dropdownC);

  _("body").append(main);
  back_system();
  handlerSC(dropdownC);
};

var search_busses = function () {
  var main,
    parent = _(".form-data-main-table");

  main = _("<div>").addClass("formdata-sb");

  var back = _("<div>")
    .addClass("back-form-sb back-yhgi")
    .attr("parent", "formdata-sb")
    .attr("last", "true")
    .append(_("<div>").append("<i>").addClass("yhgi yhgi-chevron-left-24"))
    .append(_("<span>").text("Back"));

  var usrData = _("<div>")
    .addClass("form-sb-usr-data")
    .append(
      _("<div>")
        .addClass("usr-data-sb-from select-cities")
        .attr("name", "usr-data-sb-from")
        .append(_("<i>").addClass("opf opf-location_on"))
        .append(_("<span>").text("From"))
    )
    .append(
      _("<div>")
        .addClass("usr-data-sb-to select-cities")
        .attr("name", "usr-data-sb-to")
        .append(_("<i>").addClass("opf opf-location_on"))
        .append(_("<span>").text("To"))
    )
    .append(
      _("<div>")
        .text("Search Buses")
        .addClass("usr-data-sb-submit")
        .on("click", function () {
          var from = usrData.find(".usr-data-sb-from span").text();
          var to = usrData.find(".usr-data-sb-to span").text();

          if (from === "From" || to === "To") {
            alert("Please fill All Fields");
            return;
          }

          var loader = new Loader();
          loader.createLoader("yhgc.png");
          loader.hideLoader(3);

          search_handler(from, to);
        })
    )
    .append(
      _("<div>")
        .addClass("form-sb-exchange-btn")
        .append(_("<i>").addClass("opf opf-sync_alt"))
    );

  main.append(back).append(usrData);

  parent.append(main);
  back_system();
  handlerSB(usrData);
};

var result_data = function (results, usrTF) {
  var parent = _("<div>").addClass("result-data-main");
  var header = _("<div>")
    .attr({ class: "rd-header" })
    .html(
      `<div class="back-rd-header back-yhgi" parent="result-data-main"><i class="fa fa-arrow-left"></i></div> <div class="rd-title"> Searched Data </div>`
    );
  var main = _("<div>").addClass("rd-content");

  if (!results.length > 0) {
    main.append(_("<span>").text("Bus not Found"));
  } else {
    results.forEach(function (bus) {
      var child = _("<div>")
        .addClass("rd-bus-content")
        .append(
          `<div class="rdc-bus-locations"><span>${bus.from}</span> to <span>${bus.to}</span></div>`
        )
        .on("click", function () {
          // remove_content("result-data-main");
          info_handler(usrTF, bus);
        });

      main.append(child);
    });
  }
  parent.append(header).append(main);
  _("body").append(parent);
  back_system();
};

var bus_info_ui = function () {
  var main = _("<div>").attr({ class: "businfo-main-handler" });

  var dataAble = _("<div>")
    .attr("class", "table-data-bi")
    .append(
      _("<table>")
        .append(
          _("<thead>").append(`<tr>
            <th>Station</th>
            <th>Arrive</th>
            <th>Depart</th>
            <th>Distance</th>
          </tr>`)
        )
        .append(_("<tbody>"))
    );

  main
    .append(
      `<div class="bi-header">
      <div class="back-bi-header back-yhgi" parent="businfo-main-handler"><i class="fa fa-arrow-left"></i></div>
    </div>`
    )
    .append(
      `<div class="route-dtails">
      <div class="rd-t">
        Route Details</div>
    </div>`
    )
    .append(dataAble);
  _("body").append(main);

  back_system();
};

document.ready(function () {
  var main = _(".tabs-main-table");

  main.find("div").each(function (tab) {
    _(this).on("click", function () {
      var attr = tab.getAttribute("work");
      if (attr && attr !== "") {
        window[attr]();
      } else {
        alert("Not Implemented");
        return;
      }
      main.hide();
    });
  });
});
