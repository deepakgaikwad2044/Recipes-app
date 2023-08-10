const recipes_container = document.querySelector(".recipes_container");

const searchBtn = document.querySelector("#searchBtn");

const search_input = document.querySelector("#searchBox");

const view_recipe = document.querySelector(".view_recipe");

const recipe_content = document.querySelector(".recipe_content");

const recipe_details = document.querySelector(".recipe_details");

const recipeCloseBtn = document.querySelector(".recipeCloseBtn");

recipes_container.innerHTML = "<h1> Search the meal <h1>";

/*function to send api request */

const fetchApi = async (query) => {
  recipes_container.innerHTML = `
  <img src="https://i.pinimg.com/originals/ee/1d/08/ee1d081c5bdf966b058c1a6588e73e8a.gif" class="loader_img" />`;

  try {
    const requestApi = await fetch(
      ` https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const response = await requestApi.json();

    showdata(response);
  } catch (er) {
    console.log(er);
  }
};

/* function to get api response */

const showdata = async (resp) => {
  try {
    recipes_container.innerHTML = "";

    const result = await resp.meals;

    result.map((value) => {
      const { strMealThumb, strMeal, strArea, strCategory } = value;

      var recipe_card = document.createElement("div");

      recipe_card.setAttribute("class", "recipe_card");

      recipe_card.innerHTML = ` 
  <img src= ${strMealThumb} />
          <div class="recipe_description">
            <h2> ${strMeal}</h2>
            <h3>  <span> ${strArea} </span>  dish</h3>
            <h5> belongs to <span> ${strCategory}</span> category </h5>
            
            </div>
      `;

      const view_recipeBtn = document.createElement("button");

      view_recipeBtn.innerHTML = "view recipe";
      view_recipeBtn.setAttribute("class", "view_recipeBtn");

      recipe_card.appendChild(view_recipeBtn);

      view_recipeBtn.addEventListener("click", () => {
        recipePopup(value);
        view_recipeBtn.innerHTML = "close";
        view_recipeBtn.style.backgroundColor = "green";
      });

      /*close recipe card */
      recipeCloseBtn.addEventListener("click", () => {
        recipe_content.parentElement.style.display = "none";

        view_recipeBtn.innerHTML = "view recipe";
        view_recipeBtn.style.backgroundColor = "#f38932";
      });

      recipes_container.appendChild(recipe_card);
    });
  } catch (err) {
    recipes_container.innerHTML =
      "<h1 class='errormsg'> recipe not found </h1>";
  }
};

/* recipe popup function */

const recipePopup = (meals) => {
  let buttonlist = document.querySelectorAll(".view_recipeBtn");
  buttonlist.forEach((btn) => {
    btn.innerHTML = "view recipe";
    btn.style.backgroundColor = "#f38932";
  });

  recipe_content.parentElement.style.display = "block";
  recipe_content.innerHTML = ` 
   <h3 class="recipe_name"> ${meals.strMeal} </h3>
       <h2> ingredients</h2> <ul>  
      ${fetchIngredients(meals)}
 </ul>
 
 <h2>instructions </h2>
 <div class="instructions">
 <p> ${meals.strInstructions} <p> </div>
   `;
};

/*function to fetch ingredients */

const fetchIngredients = (meal) => {
  let ingredientList = "";
  console.log(meal);
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientList += `<li> ${measure}   <b> ${ingredient} </b> </li> `;
    } else {
      break;
    }
  }
  return ingredientList;
};

/* search recipe */
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let search_val = search_input.value.trim();

  if (search_val === "") {
    recipes_container.innerHTML =
      "<h1 class='errormsg'> please enter a meal </h1>";

    return;
  }

  search_input.value = " ";
  fetchApi(search_val);
});
