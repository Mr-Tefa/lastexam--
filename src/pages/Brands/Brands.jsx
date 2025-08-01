import React, { useEffect, useState } from "react";
import LoadingCart from "../../components/LoadingCart";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://ecommerce.routemisr.com/api/v1/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingCart />;

  return (
    <div>
      <h1>Brands</h1>
      <ul>
        {brands.map((brand) => (
          <li key={brand._id}>{brand.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Brands;