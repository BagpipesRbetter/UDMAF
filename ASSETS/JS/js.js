document.addEventListener("DOMContentLoaded", () => {
    let tankData = [];
    let scene;
    let camera;
    let renderer;
    let model;
    let loader;
  
    // Initialize Three.js
    function init3d() {
      const container = document.getElementById("3d");
      const width = container.clientWidth;
      const height = container.clientHeight;
      loader = new THREE.GLTFLoader();
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 2, 5);
  
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
  
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
  
      window.addEventListener("resize", () => {
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          renderer.setSize(newWidth, newHeight);
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
      });
  }
  
    
  
    function initializeButtons() {
      document.querySelectorAll(".tank-button").forEach((button) => {
        button.addEventListener("click", () => {
          const tankId = button.id;
          const selectedTank = tankData.find(
            (tank) => tank.id === parseInt(tankId, 10),
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
          <p><strong>Country:</strong> ${tank.country}</p>
          <img src="${tank.flag}" alt="Flag" class="flag-img center">
          <p><strong>Class:</strong> ${tank.class}</p>
          <p><strong>Size:</strong> ${tank.size}</p>
        `;
        description.innerHTML = `<p>${tank.description}</p>`;
        let images = [tank.image_1, tank.image_2, tank.image_3];
        let imgIndex = 0;
        imgs.innerHTML = `<img id="tank-image" src="${images[0]}" alt="No - Image" class="tank-img">`;
        const imgElement = document.getElementById("tank-image");
  
        // Start image rotation
        if (images.length > 1) {
          setInterval(() => {
            imgIndex = (imgIndex + 1) % images.length;
            imgElement.src = images[imgIndex];
          }, 3000); // Change image every 3 seconds
        }
  
        loadModel(tank.gbl);
        infoContainer.style.opacity = "1";
      }, 300);
    }
  
    function loadModel(tank) {
      const loader = new THREE.GLTFLoader();
      loader.load(tank, (geometry) => {
        model = new THREE.Mesh(geometry);
        scene.add(model);
        camera.position.z = 5;
        renderer.render(scene, camera);
      });
    }
  
    // Fetch tank data from JSON file
    fetch("ASSETS/JSON/tank_lib.json")
    .then((response) => response.json())
    .then((data) => {
      tankData = data;
      initializeButtons();
      if (tankData.length > 0) {
        init3d();
        updateTankInfo(tankData[0]);
        
      }
    })
    .catch((error) =>
      console.error("Error loading tank data:", error)
    );
  });