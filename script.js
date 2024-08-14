const header = document.querySelector(".header__inner");
const keyG = "86da1b49c0944a45984f48d9d7a24c91"
async function fetchData() {
  const randomRecipes = [];
  const arrayImg = [];
  const titleToCard = [];

  const apiKey = keyG
  let apiUrl = `https://api.spoonacular.com/recipes/random?number=1&apiKey=${apiKey}`;
  header.addEventListener("click", async function (event) {
    let targetI = event.target.closest("a");
    if (!targetI) {
      return;
    }

    switch (targetI.id) {
      case "L0":
        apiUrl = `https://api.spoonacular.com/recipes/random?number=1&include-tags=cuisine=italian&maxCalories=1000&apiKey=${apiKey}`;
        fetchData();
        break;
      case "L1":
        apiUrl = `https://api.spoonacular.com/recipes/random?number=1&include-tags=vegetarian&apiKey=${apiKey}`;
        fetchData();
        break;
      case "L2":
        apiUrl = `https://api.spoonacular.com/recipes/random?number=1&include-tags=cuisine=greek&maxProtein=50&apiKey=${apiKey}`;
        fetchData();
        break;
      case "L3":
        apiUrl = `https://api.spoonacular.com/recipes/random?number=1&include-tags=cuisine=italian&maxAlcohol=50&apiKey=${apiKey}`;
        fetchData();
        break;
    }
  });
  try {
    for (let i = 0; i < 9; i++) {
      const response = await fetch(apiUrl);
      const responseData = await response.json();
      const image = document.getElementById(i);
      const title = document.getElementById(`text${i}`);
      titleToCard.push(title);
      const recipes = responseData.recipes;
      arrayImg.push(image);
      randomRecipes.push(recipes);
    }

    arrayImg.forEach((el, index) => {
      el.src = randomRecipes[index][0].image;
    });

    titleToCard.forEach((el, index) => {
      el.textContent = randomRecipes[index][0].title;
    });
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

fetchData();
const mainInner = document.querySelector(".main__inner");
mainInner.addEventListener("click", async function (event) {
  const target = event.target.closest(".main__card");
  if (!target) {
    return;
  }  
  const targetInfo = target.textContent.trim();
  const targetData = await search(targetInfo);
  const targetId = targetData[0].id;
  const nutritionsData = await openInfo(targetId);
  const ingridientsArray = nutritionsData.ingridientData.ingredients;
  const nutritionReady = nutritionsData.dataNutrition;
  caloriesInfo.textContent = nutritionReady.calories;
  fatInfo.textContent = nutritionReady.fat;
  carbsInfo.textContent = nutritionReady.carbs;
  proteinInfo.textContent = nutritionReady.protein;
  openImg.src = targetData[0].image;
  openTitle.textContent = targetData[0].title;
  ingridientsArray.forEach((el) => {
    openIngridients.insertAdjacentHTML(
      "afterbegin",
      `<li class="ingridients__item"> <p class="ingridients__name">${el.name}:</p><p class="ingridients__metric">${el.amount.metric.value}${el.amount.metric.unit}</p></li>`
    );
  });
  searchWindow.style.display = "block";

});
// боковое меню и все что его касается
const asideP = document.querySelector(".aside");
const btnMenu = document.querySelector(".header__menu");
btnMenu.addEventListener("click", function (event) {
  asideP.style.transform = "translateX(0%)";
});
window.addEventListener("click", function (event) {
  const target = event.target;
  const menuTarget = target.closest(".aside");
  const listTarget = target.closest("li");
  const btnTarget = target.closest(".header__menu");
  const windowTarget = target.closest(".infoAboutFood");
  const basketTarget = target.closest(".recipes__info")
  if (!btnTarget && !menuTarget && !windowTarget && !listTarget && !basketTarget) {
    asideP.style.transform = "translateX(-100%)";
    basketWindow.style.transform = "translateY(-150%)"
    searchResult.innerHTML = "";
    searchWindow.style.display = "none";
  }
});
let searchData = "";
const searchBtn = document.querySelector(".aside__searchBtn");
const searchTextArea = document.querySelector(".aside__textarea");
const searchResult = document.querySelector(".aside__searchList");
const nutritionsInfo = document.querySelector(".nutritions__list");
searchTextArea.addEventListener("input", function (event) {
  searchData = "";
  searchData = searchTextArea.value;
  console.log(searchData);
});
const searchFileData = [];
searchBtn.addEventListener("click", async function (event) {
  try {
    const searchArray = await search(searchData);
    searchArray.forEach((el) => {
      searchResult.insertAdjacentHTML(
        "afterbegin",
        `<li id="${el.id}" class="result__item"><a id="${el.title}" href="#">${el.title}</a></li>`
      );
    });
  } catch (error) {
    console.error("Ошибка при выполнении поиска:", error);
  }
});
const openImg = document.querySelector(".infoAboutFoodInner__img");
const openTitle = document.querySelector(".infoAboutFoodInner__title");
const openIngridients = document.querySelector(
  ".infoAboutFoodInner__ingridients"
);
//
const caloriesInfo = document.querySelector(".nutrtions__caloriesInfo");
const fatInfo = document.querySelector(".nutrtions__fatInfo");
const carbsInfo = document.querySelector(".nutrtions__carbsInfo");
const proteinInfo = document.querySelector(".nutrtions__proteinInfo");

const searchWindow = document.querySelector(".infoAboutFood");
searchResult.addEventListener("click", async function (event) {
  try {
    const targetForInfo = event.target.closest("li");
    const targetForData = event.target.closest("a");
    const targetId = targetForInfo.getAttribute("id");
    const targetElement = targetForData.getAttribute("id");
    searchWindow.style.display = "block";
    searchResult.innerHTML = "";
    searchTextArea.textContent = "";
    const targetElementData = await search(targetElement);
    const targetInfo = await openInfo(targetId);
    const ingridientsArray = targetInfo.ingridientData.ingredients;
    const nutritionsData = await openInfo(targetId);
    const nutritionReady = nutritionsData.dataNutrition;
    caloriesInfo.textContent = nutritionReady.calories;
    fatInfo.textContent = nutritionReady.fat;
    carbsInfo.textContent = nutritionReady.carbs;
    proteinInfo.textContent = nutritionReady.protein;
    openImg.src = targetElementData[0].image;
    openTitle.textContent = targetElementData[0].title;

    ingridientsArray.forEach((el) => {
      openIngridients.insertAdjacentHTML(
        "afterbegin",
        `<li class="ingridients__item"> <p class="ingridients__name">${el.name}:</p><p class="ingridients__metric">${el.amount.metric.value} ${el.amount.metric.unit}</p></li>`
      );
    });
  } catch (error) {
    console.error(error);
  }
});
async function search(query) {
  const key = keyG
  const api = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${query}`;
  try {
    const responseRecipe = await fetch(api);
    const responseRecipeData = await responseRecipe.json();
    console.log(responseRecipeData.results);
    return responseRecipeData.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function openInfo(id) {
  const key = keyG
  const apiEquipment = `https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=${key}`;
  const responseInfoEquipment = await fetch(apiEquipment);
  const dataInfoEquipment = await responseInfoEquipment.json();
  const apiTaste = `https://api.spoonacular.com/recipes/${id}/tasteWidget.json?apiKey=${key}`;
  const responseTaste = await fetch(apiTaste);
  const dataTaste = await responseTaste.json();
  const apiIngridient = `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${key}`;
  const responseIngridient = await fetch(apiIngridient);
  const ingridientData = await responseIngridient.json();
  const apiNutrition = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${key}`;
  const responseNutrition = await fetch(apiNutrition);
  const dataNutrition = await responseNutrition.json();

  return {
    dataInfoEquipment,
    dataTaste,
    ingridientData,
    dataNutrition,
  };
}
fetchData();
const headerBtn = document.querySelector(".header__item");
header.addEventListener("mouseover", function (event) {
  const target = event.target.closest("li");
  if (!target) {
    return;
  }
  target.style.border = "1px dashed";
});
header.addEventListener("mouseout", function (event) {
  const target = event.target.closest("li");
  if (!target) {
    return;
  }
  target.style.border = "none";
});

//Добавление карточки в корзину
const addBtn = document.querySelector(".card__cardAdd")
const recipesList = document.querySelector(".recipes__list")
const cardParent = document.querySelector(".main__inner")
const basketNotification = document.querySelector(".basket__notification")
addBtn.addEventListener("click", async function (event) {
  try {
    
  const target = event.target.closest(".main__card");
  
 
  const targetInfo = target.textContent.trim();
  const targetData = await search(targetInfo);
  const targetId = targetData[0].id
  console.log(2222)
 
      const cardTitle = targetData[0].title
      const cardImg = targetData[0].image

      recipesList.insertAdjacentHTML(
        "afterbegin",
        `<li class="recipes__item"><img class="recipes__img" src="${cardImg}"/><p class="recipes__text">${cardTitle}</p></li>`
      )
    
} catch(error) {
  console.error(error)
}
}); 
// Корзина
const basketBtn = document.querySelector(".account__logo")
const basketWindow = document.querySelector(".recipes__info")
basketBtn.addEventListener("click", function(event) {
  basketWindow.style.transform = "translateY(0%)"
})

