import React, { useEffect, useState } from "react";
import LoadingCart from "../../components/LoadingCart";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://ecommerce.routemisr.com/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingCart />;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;