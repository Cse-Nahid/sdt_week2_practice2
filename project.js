// project.js

const loadAllMeals = (mealName) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
      .then(res => res.json())
      .then(data => {
          console.log(data.meals);
          displayMeals(data);
      });
};

loadAllMeals('');

const displayMeals = (data) => {
  const mealsContainer = document.getElementById("meals-container");
  mealsContainer.innerHTML = '';

  if (data.meals) {
      data.meals.forEach(meal => {
          const mealDiv = document.createElement('div');
          mealDiv.classList.add("col");
          mealDiv.innerHTML = `
              <div class="card bg-success border border-warning">
                  <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                  <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                          <div>
                              <h3 class="text-warning">${meal.strMeal}</h3>
                          </div>
                          <div>
                              <a href="${meal.strYoutube}" target="_blank" class="text-danger m-1"><i class="fa-brands fa-youtube fa-2x"></i></a>
                          </div>
                      </div>
                      <h6 class="text-white">Category: ${meal.strCategory}</h6>
                      <p class="text-white m-0">Area: ${meal.strArea}</p>
                      <p class="text-white m-0">Instructions: ${meal.strInstructions.slice(0, 80)}...</p>
                  </div>
                  <div class="card-footer d-flex align-items-center justify-content-between">
                      <button onclick="singleMeal('${meal.idMeal}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
                      <button id="add-meal-button-${meal.idMeal}" onclick="addSingleMeal('${meal.idMeal}')" class="btn btn-info">Add To List</button>
                  </div>
              </div>
          `;
          mealsContainer.appendChild(mealDiv);
      });
  } else {
      mealsContainer.innerHTML = `<h4 class="text-danger">Sorry, no meals found.</h4>`;
  }
};

const searchItem = (event) => {
  event.preventDefault();
  const mealName = document.getElementById('searchInput').value;
  if (mealName) {
      loadAllMeals(mealName);
  } else {
      document.getElementById('meals-container').innerHTML = '';
  }
  document.getElementById('searchInput').value = '';
};

document.getElementById('searchForm').addEventListener('submit', searchItem);

document.getElementById('searchInput').addEventListener('input', function(event) {
  const mealName = event.target.value;
  if (mealName) {
      loadAllMeals(mealName);
  } else {
      document.getElementById('meals-container').innerHTML = '';
  }
});

const single_meal = (meal) => {
  const title = document.getElementById("single-meal-title");
  const body = document.getElementById("single-meal-body");
  console.log(meal.strMeal);
  title.innerText = meal.strMeal;

  body.innerHTML = `
      <div class="card text-white">
          <div class="row g-0">
              <div class="col-md-4 d-flex justify-content-center align-items-center">
                  <img src=${meal.strMealThumb} class="img-fluid rounded-start" alt="${meal.strMeal}">
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <p class="text-white"><small class="text-primary">Category: ${meal.strCategory}</small></p>
                      <p class="card-title text-primary">Area: ${meal.strArea}</p>
                      <p class="text-warning">${meal.strInstructions}</p>
                  </div>
              </div>
          </div>
      </div>
  `;
}

const addSingleMeal = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => {
          addToList(data.meals[0]);
      });
}

const singleMeal = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => {
          single_meal(data.meals[0]);
      });
}

let addMealList = [];
document.getElementById("added-meals-quantity").innerText = 0;

const addToList = (meal) => {
  if (addMealList.length < 10) {
      if (addMealList.some(m => m.idMeal === meal.idMeal)) {
          alert('Already added');
      } else {
          addMealList.push(meal);
          document.getElementById(`add-meal-button-${meal.idMeal}`).disabled = true;
          document.getElementById(`add-meal-button-${meal.idMeal}`).innerText = "Added Successfully";
          viewAddMealList();
      }
  } else {
      alert("Sorry! You cannot add more than 10 meals!");
  }
}

const viewAddMealList = () => {
  document.getElementById("added-meals-quantity").innerText = addMealList.length;

  const addMealContainer = document.getElementById("added-meals-container");
  addMealContainer.innerHTML = '';

  if (addMealList.length > 0) {
      addMealContainer.classList.add("border", "border-info");
      addMealList.forEach(meal => {
          const mealDiv = document.createElement('div');
          mealDiv.classList.add("col");
          mealDiv.innerHTML = `
              <div class="card bg-success border border-info">
                  <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                  <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                          <div>
                              <h3 class="text-warning">${meal.strMeal}</h3>
                          </div>
                          <div>
                              <a href="${meal.strYoutube}" target="_blank" class="text-danger m-1"><i class="fa-brands fa-youtube fa-2x"></i></a>
                          </div>
                      </div>
                      <h6 class="text-white">Category: ${meal.strCategory}</h6>
                      <p class="text-white m-0">Area: ${meal.strArea}</p>
                      <p class="text-white m-0">Instructions: ${meal.strInstructions.slice(0, 80)}...</p>
                  </div>
                  <div class="card-footer d-flex align-items-center justify-content-between">
                      <button onclick="singleMeal('${meal.idMeal}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
                      <button onclick="removeFromList('${meal.idMeal}')" class="btn btn-danger">Remove</button>
                  </div>
              </div>
          `;
          addMealContainer.appendChild(mealDiv);
      });
  } else {
      addMealContainer.innerHTML = `<h4 class="text-danger">No Meals Added.</h4>`;
  }
}

const removeFromList = (mealID) => {
  addMealList = addMealList.filter(meal => meal.idMeal != mealID);
  document.getElementById(`add-meal-button-${mealID}`).disabled = false;
  document.getElementById(`add-meal-button-${mealID}`).innerText = "Add To List";
  viewAddMealList();
}
