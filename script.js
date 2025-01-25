const carsContainer = document.getElementById("cars-container");
let allCars = [];
let filteredCars = [];
let currentPage = 1;
const carsPerPage = 12;

async function fetchCars() {
  try {
    const response = await fetch(
      "https://dealership.naman.zip/cars/sort?key=price&direction=asc"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cars data");
    }
    allCars = await response.json();
    filteredCars = allCars;
    renderCars(filteredCars);
    createPagination(filteredCars.length);
  } catch (error) {
    carsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function renderCars(cars) {
  carsContainer.innerHTML = "";
  if (cars.length === 0) {
    carsContainer.innerHTML = "<p>No cars found</p>";
    return;
  }
  const startIndex = (currentPage - 1) * carsPerPage;
  const carsToDisplay = cars.slice(startIndex, startIndex + carsPerPage);
  carsToDisplay.forEach((car) => {
    const carCard = document.createElement("div");
    carCard.className = "car-card";
    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.make} ${car.model}">
      <div class="car-info">
        <h2>${car.make} ${car.model}</h2>
        <p>Year: ${car.year}</p>
        <p>Price: $${car.price.toLocaleString()}</p>
      </div>
    `;
    carCard.addEventListener("click", () => {
      fetchCarDetails(car.id);
    });
    carsContainer.appendChild(carCard);
  });
}

async function fetchCarDetails(carId) {
  try {
    const response = await fetch(`https://dealership.naman.zip/car/${carId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch car details");
    }
    const car = await response.json();
    displayCarDetails(car);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function displayCarDetails(car) {
    document.querySelectorAll(".pagination-button").forEach(btn => {
      btn.classList.remove("active");
    });
    const carDetails = `
      <div class="car-details">
        <img src="${car.image}" alt="${car.make} ${car.model}">
        <h2>${car.make} ${car.model} (${car.year})</h2>
        <p><strong>Price:</strong> $${car.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${car.mileage} miles</p>
        <p><strong>Condition:</strong> ${car.condition}</p>
        <p><strong>Fuel Type:</strong> ${car.fuel_type}</p>
        <p><strong>Transmission:</strong> ${car.transmission}</p>
        <p><strong>Color:</strong> ${car.color}</p>
        <p><strong>VIN:</strong> ${car.vin}</p>
        <p>${car.description}</p>
        <button id="back-to-home" class="btn">Back to Home</button>
      </div>
    `;
    carsContainer.innerHTML = carDetails;
    document
      .getElementById("back-to-home")
      .addEventListener("click", () => {
        renderCars(filteredCars);
        createPagination(filteredCars.length);
      });
  }

function createPagination(totalCars) {
    const paginationContainer = document.getElementById("pagination-controls");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalCars / carsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.className = "pagination-button";
      if (i === currentPage) {
        pageButton.classList.add("active");
      }
      pageButton.addEventListener("click", () => {
        document.querySelectorAll(".pagination-button").forEach(btn => {
          btn.classList.remove("active");
        });
        pageButton.classList.add("active");
        currentPage = i;
        renderCars(filteredCars);
      });
      paginationContainer.appendChild(pageButton);
    }
  }

document.getElementById("search-bar").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filteredCars = allCars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderCars(filteredCars);
  createPagination(filteredCars.length);
});

document.getElementById("price-range").addEventListener("input", (e) => {
  const maxPrice = parseInt(e.target.value, 10);
  document.getElementById("max-price-label").textContent = `$${maxPrice.toLocaleString()}`;
  filteredCars = allCars.filter((car) => car.price <= maxPrice);
  currentPage = 1;
  renderCars(filteredCars);
  createPagination(filteredCars.length);
});

fetchCars();
