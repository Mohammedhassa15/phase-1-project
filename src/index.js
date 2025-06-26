const API_URL = "http://localhost:3000";
// Get form and input elements from the page
const carForm = document.getElementById("car-form");
const carList = document.getElementById("car-list");
const brandInput = document.getElementById("brand");
const modelInput = document.getElementById("model");
const priceInput = document.getElementById("pricePerDay");
const imageUrlInput = document.getElementById("imageUrl");
const availableInput = document.getElementById("available");

const hireForm = document.getElementById("hire-form");
const hireName = document.getElementById("hire-name");
const hireEmail = document.getElementById("hire-email");
const hireLocation = document.getElementById("hire-location");
const hireCarId = document.getElementById("hire-car-id");
const hireConfirmation = document.getElementById("hire-confirmation");

const carConfirmation = document.getElementById("car-confirmation");
const hiredCarsSection = document.getElementById("hired-cars");

const availabilityFilter = document.getElementById("filter-availability");
const brandFilter = document.getElementById("filter-brand");
// kepp track og editing made since we are using the same form
let isEditing = false;
let editCarId = null;

// Navigation elements
document.getElementById("nav-home").addEventListener("click", () => showSection("home"));
document.getElementById("nav-about").addEventListener("click", () => {
  showSection("about");
  fetchCars();
});
document.getElementById("nav-hire").addEventListener("click", () => showSection("hire"));
document.getElementById("nav-hired").addEventListener("click", () => {
  showSection("hired");
  fetchHiredCars();
});
document.getElementById("nav-contact").addEventListener("click", () => showSection("contact"));
// Show selected section only
function showSection(section) {
  document.getElementById("home-section").style.display = section === "home" ? "block" : "none";
  document.getElementById("about-section").style.display = section === "about" ? "block" : "none";
  document.getElementById("hire-section").style.display = section === "hire" ? "block" : "none";
  document.getElementById("hired-section").style.display = section === "hired" ? "block" : "none";
  document.getElementById("contact-section").style.display = section === "contact" ? "block" : "none";
}

// Submission of  Car Form 
carForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const price = parseInt(priceInput.value);
  if (isNaN(price) || price < 60000) {
    alert("Price must be at least 60,000 KES.");
    return;
  }

  const carData = {
    brand: brandInput.value,
    model: modelInput.value,
    pricePerDay: price,
    imageUrl: imageUrlInput.value,
    available: availableInput.checked,
  };

  if (isEditing) {
    updateCar(editCarId, carData);
  } else {
    createCar(carData);
  }
});

// Creating a new car using  the POST method
function createCar(data) {
  fetch(`${API_URL}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(() => {
      carForm.reset();
      fetchCars();
      carConfirmation.textContent = " Car added successfully!";
      setTimeout(() => {
        carConfirmation.textContent = "";
      }, 3000);
    });
}

// Fetch & Display Cars with Filters by either availability or by brand
function fetchCars() {
  fetch(`${API_URL}/cars`)
    .then(res => res.json())
    .then(cars => {
      const availability = availabilityFilter?.value || "all";
      const brandSearch = brandFilter?.value.toLowerCase() || "";

      const filtered = cars.filter(car => {
        const matchStatus =
          availability === "all" ||
          (availability === "available" && car.available) ||
          (availability === "unavailable" && !car.available);
        const matchBrand = car.brand.toLowerCase().includes(brandSearch);
        return matchStatus && matchBrand;
      });

      carList.innerHTML = "";
      filtered.forEach(displayCar);
    });
}
// Show one car card on the page
function displayCar(car) {
  const card = document.createElement("div");
  card.className = "car-card";
  card.innerHTML = `
    <img src="${car.imageUrl}" alt="${car.brand} ${car.model}" />
    <h3>${car.brand} ${car.model}</h3>
    <p><strong>Price:</strong> KES ${car.pricePerDay}/day</p>
    <p><strong>Status:</strong> ${car.available ? "Available" : "Not Available"}</p>
    <button class="myEditButton"><i class='bx bx-edit-alt'></i></button>
    <button class="myDeleteButton"><i class='bx bx-trash' style='color:#ffffff' ></i></button>
    <button class="myHireButton" ${!car.available ? "disabled" : ""}>Hire Now</button>
  `;
  card.querySelector(".myEditButton").addEventListener("click", () => editCar(car.id));
  card.querySelector(".myDeleteButton").addEventListener("click", () => deleteCar(car.id));
  card.querySelector(".myHireButton").addEventListener("click", () => startHire(car.id));
  carList.appendChild(card);
}
 // Show edit form
function editCar(id) {
  fetch(`${API_URL}/cars/${id}`)
    .then(res => res.json())
    .then(car => {
      brandInput.value = car.brand;
      modelInput.value = car.model;
      priceInput.value = car.pricePerDay;
      imageUrlInput.value = car.imageUrl;
      availableInput.checked = car.available;
      isEditing = true;
      editCarId = car.id;
      showSection("home");
    });
}

function updateCar(id, data) {
  fetch(`${API_URL}/cars/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(() => {
    isEditing = false;
    editCarId = null;
    carForm.reset();
    fetchCars();
    showSection("about");
  });
}

function deleteCar(id) {
  if (confirm("Are you sure you want to delete this car?")) {
    fetch(`${API_URL}/cars/${id}`, { method: "DELETE" }).then(() => fetchCars());
  }
}

// The process of hiring a car 
function startHire(carId) {
  hireCarId.value = carId;
  hireForm.reset();
  hireConfirmation.textContent = "";
  showSection("hire");
}

hireForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = hireName.value.trim();
  const email = hireEmail.value.trim();
  const location = hireLocation.value.trim();
  const carId = hireCarId.value;

  if (name && email && location && carId) {
    // Mark car as unavailable since now its hired
    fetch(`${API_URL}/cars/${carId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: false }),
    })
      .then(() =>
        fetch(`${API_URL}/hires`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carId, name, email, location }),
        })
      )
      // Save hire record
      .then(() => {
        hireConfirmation.textContent = `Thank you, ${name}! Your car will be delivered to ${location}.`;
        hireForm.reset();
        fetchCars();
      });
  } else {
    hireConfirmation.textContent = "Please fill out all fields.";
  }
});

// Hired Cars Section
function fetchHiredCars() {
  fetch(`${API_URL}/hires`)
    .then(res => res.json())
    .then(hires => {
      hiredCarsSection.innerHTML = "";
      hires.forEach(hire => {
        fetch(`${API_URL}/cars/${hire.carId}`)
          .then(res => res.json())
          .then(car => {
            const card = document.createElement("div");
            card.className = "car-card";
            card.innerHTML = `
              <img src="${car.imageUrl}" />
              <h3>${car.brand} ${car.model}</h3>
              <p><strong>Price:</strong> KES ${car.pricePerDay}/day</p>
              <p><strong>Status:</strong> Not Available</p>
              <p><strong>Hired by:</strong> ${hire.name} (${hire.email})</p>
              <p><strong>Location:</strong> ${hire.location}</p>
            `;

            const unhireBtn = document.createElement("button");
            unhireBtn.textContent = "Unhire";
            unhireBtn.className = "unhire-btn";
            unhireBtn.addEventListener("click", () => unhireCar(car.id, hire.id));
            card.appendChild(unhireBtn);

            hiredCarsSection.appendChild(card);
          });
      });
    });
}

// Unhire Function 
function unhireCar(carId, hireId) {
  fetch(`${API_URL}/cars/${carId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ available: true }),
  })
    .then(() =>
      fetch(`${API_URL}/hires/${hireId}`, {
        method: "DELETE",
      })
    )
    .then(() => {
      alert(" Car has been made available again.");  // confirmation message that the car is available for hire again
      fetchCars();
      fetchHiredCars();
    });
}

// Run filters when changed
availabilityFilter?.addEventListener("change", fetchCars);
brandFilter?.addEventListener("input", fetchCars);
