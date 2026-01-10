import { createContext, useContext, useEffect, useState } from "react";
import { categories } from "../APIs/homeApis";  
const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [Categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const findCategoryById = (id) => {
    // console.log("the id:",id ,"and Cats",Categories)
   return Categories.findLast(category => {
  return category.id === id;
});

  };

  useEffect(() => {
    const getCategories = async () => {
      try {

        const response = await categories()
        const data = response.data?.data?.categories

        // console.log("cats : ",data)
        

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories:Categories, loading , findCategoryById }}>
      {children}
    </CategoriesContext.Provider>
  );
};

// custom hook (recommended)
export const useCategories = () => useContext(CategoriesContext);
