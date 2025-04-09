import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
document.addEventListener("DOMContentLoaded", () => {
  let tankData = [];
  let scene, camera, renderer, controls;

  function init3d(initialModelPath) {
    // Pass the initial model path
    const container = document.getElementById("top-main");
    const canvas = container.querySelector("canvas");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Initialize OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    // **Add Ambient Light:**
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Color (white), Intensity (0.9)
    scene.add(ambientLight);

    // Add Directional Light (optional, but good to have for more defined lighting)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    loadTankModel(initialModelPath); // Load the initial model
    window.onresize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();
    };
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // Update controls in each frame
      renderer.render(scene, camera);
    }
    animate();
  }

  function loadTankModel(modelPath) {
    // Clear the previous model from the scene
    scene.traverse((child) => {
      if (child.isMesh || child.isGroup) {
        scene.remove(child);
      }
    });

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      function (gltf) {
        console.log("Loaded GLTF:", gltf);
        scene.add(gltf.scene);

        // **Scale the entire model:**
        const scaleFactor = 6; // Adjust this value to make it bigger or smaller
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        const size = boundingBox.getSize(new THREE.Vector3());
        const center = boundingBox.getCenter(new THREE.Vector3());

        console.log("Model Size:", size);
        console.log("Model Center:", center);

        camera.position.z = Math.max(size.x, size.y, size.z) * 1.5;
        controls.target.copy(center); // Make the controls orbit around the model's center
        controls.update(); // Update controls initially
      },
      undefined,
      function (error) {
        console.error("An error happened loading the model", error);
      }
    );
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
          loadTankModel(selectedTank.model); // Load the corresponding 3D model
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
          <p><strong>Name:</strong><br/>${tank.name}</p>
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
      imgs.innerHTML = `<img id="tank-image" src="${images[0]}" alt="No - Image - loaded" class="rounded-md shadow-lg w-full h-auto object-contain">`;
      const imgElement = document.getElementById("tank-image");

      if (images.length > 1) {
        setInterval(() => {
          imgIndex = (imgIndex + 1) % images.length;
          imgElement.src = images[imgIndex];
        }, 3000); // Change image every 3 seconds
      }

      // Update model path in the model viewer
      infoContainer.style.opacity = "1";
    }, 300);
  }

  // Fetch tank data from JSON file
  fetch("src/tank_lib.json")
    .then((response) => response.json())
    .then((data) => {
      tankData = data;
      initializeButtons();
      if (tankData.length > 0) {
        init3d("src/3d/Tiger_I.glb"); // Initialize the 3D environment with the first tank's model
        updateTankInfo(tankData[0]); // Update info for the initial tank
      }
    })
    .catch((error) => console.error("Error loading tank data:", error));
});
