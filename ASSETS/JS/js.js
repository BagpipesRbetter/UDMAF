document.addEventListener("DOMContentLoaded", () => {
  let tankData = [];

  // Initialize the 3D model viewer with a placeholder model
  function init3d() {
    const modelViewer = document.getElementById("tank-model");

    // Set the model source based on the first tank data initially
    if (tankData.length > 0) {
      loadModel(tankData[0].gbl);
    }
  }

  function loadModel(modelPath) {
    const modelViewer = document.getElementById("tank-model");
    modelViewer.setAttribute("src", modelPath); // Set model path for model-viewer
  }

  function initializeButtons() {
    document.querySelectorAll(".tank-button").forEach((button) => {
      button.addEventListener("click", () => {
        const tankId = button.id;
        const selectedTank = tankData.find(
          (tank) => tank.id === tankId // Directly compare the ID string
        );
        if (selectedTank) {
          updateTankInfo(selectedTank);
        }
      });
    });
  }

  function updateTankInfo(tank) {
    const infoContainer = document.getElementById("info");
    const specs = document.getElementById("specs");
    const description = document.getElementById("description");
    const imgs = document.getElementById("imgs");

    infoContainer.style.opacity = "1";
    setTimeout(() => {
      specs.innerHTML = `
          <p><strong>Name:</strong> ${tank.name}</p>
          <p><strong>Country:</strong> <span class="inline-flex items-center">
            <img src="${tank.flag}" alt="Flag" class="flag-img ml-2">
          </span></p>
          <p><strong>Class:</strong> ${tank.class}</p>
          <p><strong>Size:</strong> ${tank.size}</p>
        `;
      description.innerHTML = `<p>${tank.description}</p>`;

      // Handle rotating images
      let images = [tank.image_1, tank.image_2, tank.image_3];
      let imgIndex = 0;
      imgs.innerHTML = `<img id="tank-image" src="${images[0]}" alt="No - Image - loaded" class="tank-img">`;
      const imgElement = document.getElementById("tank-image");

      if (images.length > 1) {
        setInterval(() => {
          imgIndex = (imgIndex + 1) % images.length;
          imgElement.src = images[imgIndex];
        }, 3000); // Change image every 3 seconds
      }

      // Update model path in the model viewer
      loadModel(tank.gbl);
      infoContainer.style.opacity = "1";
    }, 300);
  }

  // Fetch tank data from JSON file
  fetch("ASSETS/JSON/tank_lib.json")
    .then((response) => response.json())
    .then((data) => {
      tankData = data;
      initializeButtons();
      if (tankData.length > 0) {
        init3d(); // Initialize the first tank model on page load
        updateTankInfo(tankData[0]);
      }
    })
    .catch((error) => console.error("Error loading tank data:", error));
});
