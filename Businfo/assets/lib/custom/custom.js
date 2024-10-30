let resolveConfirmc;
document.ready(function(){
  var a = _("<div>")
  .attr({'id': 'customConfirmDialog',class: "custom-confirm-dialog"})
  .append(_("<div>")
  .attr('class', 'custom-confirm-content')
  .append(_('<h3>').text("Are you sure?")).append(`<p id="customConfirmMessage"></p>`).append(`<div class="custom-confirm-buttons"><button id="confirmYes">Yes</button><button id="confirmNo">No</button></div>`))
  
  _("body").append(a)
})

function showConfirmDialogc(message) {
  const dialog = document.getElementById('customConfirmDialog');
  const messageElement = document.getElementById('customConfirmMessage');
  const yesButton = document.getElementById('confirmYes');
  const noButton = document.getElementById('confirmNo');

  // Set the confirmation message
  messageElement.textContent = message;

  // Show the dialog
  dialog.style.display = 'flex';

  // Handle button clicks
  yesButton.onclick = () => {
    dialog.style.display = 'none';
    if (resolveConfirmc) resolveConfirmc(true);
  };

  noButton.onclick = () => {
    dialog.style.display = 'none';
    if (resolveConfirmc) resolveConfirmc(false);
  };
}

function confirm(message) {
  return new Promise((resolve) => {
    resolveConfirmc = resolve;
    showConfirmDialogc(message);
  });
}

// alert
document.ready(function(){
  var a = _('<div>').attr({class: 'customalertbar', id: 'customAlert'}).append(`<span class="closebtn opf" onclick="this.parentElement.style.display='none'">&times;</span> <h2> Yhg Indian WSM </h2> <hr>
    <div class="sms-content">
          <span>Message:</span>
          <p></p>
        </div>`).hide()
        
  _('body').append(a)
})
function alert(sms) {
  var a = _("#customAlert"),
    b = a.find('p')

    yhgquery(document).on('keydown', function(e){
      if (e.ctrlKey && e.key === "b") {
        a.hide()
      }
    })

  b.html(sms)
  a.show()
}

class Loader {
  constructor() {
    this.loaderElement = null;
  }

  createLoader(logoSrc) {
    // Create a full-screen overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(255, 255, 255, 1)"; // Semi-transparent background
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999"; // Make sure it's above everything else

    // Create loader container
    this.loaderElement = document.createElement("div");
    this.loaderElement.className = "loader";

    // Create spinner
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinner.style.cssText = `
          width: 100% ;
          height: 100% ;
          border: 8px solid #e0e0e0; /* Light grey background */
          border-top: 8px solid #3498db; /* Blue color for the spinner */
            border-radius: 50%;
            animation: spin linear infinite 1s;
        `
    this.loaderElement.appendChild(spinner);

    // Create logo
    if (logoSrc) {
      const logo = document.createElement("img");
      logo.src = logoSrc; // Set logo path
      logo.alt = "Logo";
      logo.className = "logo";
      this.loaderElement.appendChild(logo);
      var a = document.createElement('span')
      a.className = "logo bg"
      this.loaderElement.appendChild(a)
    }

    overlay.appendChild(this.loaderElement);
    document.body.appendChild(overlay); // Add overlay to the body
  }

  hideLoader(duration) {
    setTimeout(() => {
      if (this.loaderElement) {
        this.loaderElement.parentElement.remove(); // Remove the overlay
      }
    }, duration * 1000);
  }

  options(config) {
    if (this.loaderElement) {
      // Apply width and height
      if (config.width) {
        this.loaderElement.style.width = config.width;
      }
      if (config.height) {
        this.loaderElement.style.height = config.height;
      }

      // Apply spinner color
      if (config.spinnerColor) {
        const spinner = this.loaderElement.querySelector(".spinner");
        spinner.style.borderTopColor = config.spinnerColor;
      }

      // Apply logo size
      if (config.logoSize) {
        const logo = this.loaderElement.querySelector(".logo");
        logo.style.width = config.logoSize;
      }
    }
  }
}

// pages 
// settings
function createSettingsPage(settingsId, settingsTitle, settings) {
  // Create settings page container
  let divsp = document.createElement('div');
  divsp.className = 'setting-page';
  divsp.id = settingsId;
  divsp.classList.add('transparent');

  let closeIcon = document.createElement('i')
  var closeIcons = closeIcon.style
  closeIcons.fontSize = '30px'
  closeIcons.position = 'absolute'
  closeIcons.right = "20px"
  closeIcons.top = "5px"
  closeIcon.className = 'opf opf-clear'
  // closeIcon.innerHTML = '&#215;'
  closeIcon.onclick = function() {
    divsp.style.display = 'none'
  }
  divsp.appendChild(closeIcon)
  // Create heading for the settings
  let center = document.createElement('center');
  let heading = document.createElement('h1');
  heading.textContent = settingsTitle;
  heading.style.color = 'unset';
  center.appendChild(heading);
  divsp.appendChild(center);

  // Create and append settings to the div
  settings.forEach(setting => {
    let settingGroup = document.createElement('div');
    settingGroup.classList.add('setting-group');

    // Create label
    let label = document.createElement('label');
    label.setAttribute('for', setting.id);
    label.textContent = setting.label;
    settingGroup.appendChild(label);

    // Create input element
    let input

    switch (setting.type) {
      case 'select':
        input = document.createElement('select')

        setting.options.forEach(function(e) {
          let option = document.createElement('option')
          option.textContent = e.label
          option.value = e.value
          input.appendChild(option)
        })
        break;

      default:
        input = document.createElement('input')
    }
    Object.keys(setting).forEach(function(e) {
      input.setAttribute(e, setting[e])
    })
    settingGroup.appendChild(input);
    divsp.appendChild(settingGroup);
  });

  // Create save button
  let saveButton = document.createElement('button');
  saveButton.id = 'save-settings';
  saveButton.textContent = 'Save Settings';
  divsp.appendChild(saveButton);

  // Append the settings div to the body or an appropriate container
  document.body.appendChild(divsp);
}