import React, { useEffect, useState } from 'react';
import './App.css';
import Recipe from './Recipe.js';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("chicken_breast"); // default

  useEffect(() => {
    getRecipes();
  }, [query]);

  const getRecipes = async () => {
    // Search by ingredient
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
    );
    const data = await response.json();

    // filter.php only gives id, name, image → we need to fetch full details for each recipe
    if (data.meals) {
      const detailedRecipes = await Promise.all(
        data.meals.map(async (meal) => {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const mealData = await res.json();
          return mealData.meals[0]; // full recipe
        })
      );
      setRecipes(detailedRecipes);
    } else {
      setRecipes([]);
    }
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search); // set ingredient from search box
    setSearch("");
  };

  return (
    <div className="App">
      <h1 className="title">TasteBook</h1>


      <form className="search-form" onSubmit={getSearch}>
        <input
          className="search-bar"
          type="text"
          value={search}
          onChange={updateSearch}
          placeholder="Enter an ingredient (e.g. chicken)"
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      <div className="recipes">
        {recipes.map((recipe) => (
          <Recipe
            key={recipe.idMeal}
            title={recipe.strMeal}
            image={recipe.strMealThumb}
            ingredients={Object.keys(recipe)
              .filter((key) => key.startsWith("strIngredient") && recipe[key])
              .map((key) => ({ text: recipe[key] }))} // ✅ works with Recipe.js
          />
        ))}
      </div>
    </div>
  );
}

export default App;
