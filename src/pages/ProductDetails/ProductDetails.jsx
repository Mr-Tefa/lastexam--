import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus, faStar, faMinus, faPlus, faShare, faTruck, faShieldAlt, faUndo, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { apiRequest } from '../../api';
import { useCart } from '../../context/CartContext';
import LoadingCart from "../../components/LoadingCart";

export default function ProductDetails() {
  console.log('=== ProductDetails.jsx LOADED ===');
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [tab, setTab] = useState('details');
  const [suggested, setSuggested] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useCart();

  useEffect(() => {
    if (!id) return;
    // جلب تفاصيل المنتج
    fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.data);
        setLoading(false);
        // حفظ المنتج في localStorage['recentlyViewed']
        if (data.data) {
          let viewed = [];
          try {
            viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
          } catch {}
          // منع التكرار
          if (!viewed.some(p => p._id === data.data._id)) {
            viewed.unshift(data.data);
            // احتفظ فقط بآخر 10 منتجات
            if (viewed.length > 10) viewed = viewed.slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
          }
        }
      })
      .catch(() => setLoading(false));
    // جلب منتجات مقترحة
    fetch(`https://ecommerce.routemisr.com/api/v1/products?limit=6`)
      .then(res => res.json())
      .then(data => setSuggested(data.data || []));
    // جلب المنتجات التي تمت مشاهدتها مؤخراً (محاكاة)
    fetch(`https://ecommerce.routemisr.com/api/v1/products?recentlyViewed=true`)
      .then(res => res.json())
      .then(data => setRecentlyViewed(data.data || []));
  }, [id]);

  if (loading) return <LoadingCart />;
  if (!product) return <div className="text-center py-20 text-lg font-bold">Product not found</div>;

  const discountPercentage = product.priceAfterDiscount 
    ? Math.round(100 - (product.priceAfterDiscount / product.price) * 100)
    : 0;

  // Handler for adding suggested/recent product to cart
  const handleAddProductToCart = async (productId) => {
    const token = localStorage.getItem('token');
    console.log('handleAddProductToCart called, token:', token, 'productId:', productId);
    if (!token) {
      let count = Number(localStorage.getItem('guestCartCount') || 0);
      localStorage.setItem('guestCartCount', count + 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return;
    }
    try {
      const res = await apiRequest('/cart', {
        method: 'POST',
        token,
        body: { productId, count: 1 },
      });
      console.log('Add suggested/recent to cart response:', res);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Add suggested/recent to cart error:', err);
    }
  };
  // Handler for toggling wishlist for suggested/recent product
  const handleToggleProductWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    console.log('handleToggleProductWishlist called, token:', token, 'productId:', productId);
    if (!token) {
      let count = Number(localStorage.getItem('guestWishlistCount') || 0);
      localStorage.setItem('guestWishlistCount', count + 1);
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      return;
    }
    try {
      const res = await apiRequest('/wishlist', {
        method: 'POST',
        token,
        body: { productId },
      });
      console.log('Add suggested/recent to wishlist response:', res);
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error('Add suggested/recent to wishlist error:', err);
    }
  };

  return (
    <>
      {console.log('Rendering ProductDetails')}
      <main className="bg-gray-50 min-h-screen w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="lg:w-1/2 space-y-4">
              <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        selectedImage === index ? 'border-green-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">In Stock</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  <span className="font-semibold">{product.ratingsAverage}</span>
                  <span className="text-gray-500">({product.ratingsQuantity} reviews)</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.priceAfterDiscount || product.price}
                  </span>
                  {product.priceAfterDiscount && (
                    <>
                      <span className="text-xl line-through text-gray-400">
                        ${product.price}
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{product.description}</p>
              </div>
              {/* Weight/Options */}
              <div className="flex gap-2 mb-4">
                <button className="px-4 py-2 border rounded-lg font-semibold bg-green-50 text-green-700">250g</button>
                <button className="px-4 py-2 border rounded-lg font-semibold text-gray-600">500g</button>
                <button className="px-4 py-2 border rounded-lg font-semibold text-gray-600">1kg</button>
              </div>
              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <span className="text-xs text-gray-500 ml-2">Only 12 items left in stock</span>
              </div>
              {/* Actions */}
              <div className="flex gap-4 mb-6">
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2" onClick={() => addToCart(product)}>
                  <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
                </button>
                <button className="bg-white border border-gray-300 text-gray-500 py-3 px-4 rounded-lg hover:border-green-500 hover:text-green-500 transition flex items-center justify-center" onClick={() => addToWishlist(product)}>
                  <FontAwesomeIcon icon={isInWishlist ? faHeart : faHeartRegular} />
                </button>
                {isInCart && (
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-2" onClick={() => navigate('/Checkout')}>
                    <FontAwesomeIcon icon={faCreditCard} /> الدفع الآن
                  </button>
                )}
              </div>
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faTruck} className="text-green-600 text-xl" />
                  <div>
                    <div className="font-semibold">Free Delivery</div>
                    <div className="text-sm text-gray-500">Free shipping on orders over $50</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faUndo} className="text-green-600 text-xl" />
                  <div>
                    <div className="font-semibold">30 Days Return</div>
                    <div className="text-sm text-gray-500">Satisfaction guaranteed or money back</div>
                  </div>
                </div>
              </div>
              {/* Tabs */}
              <div className="border-b mb-4 flex gap-8">
                <button onClick={() => setTab('details')} className={`pb-2 font-semibold ${tab === 'details' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`}>Product Details</button>
                <button onClick={() => setTab('nutrition')} className={`pb-2 font-semibold ${tab === 'nutrition' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`}>Nutrition Facts</button>
                <button onClick={() => setTab('reviews')} className={`pb-2 font-semibold ${tab === 'reviews' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`}>Reviews (149)</button>
                <button onClick={() => setTab('shipping')} className={`pb-2 font-semibold ${tab === 'shipping' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`}>Shipping & Returns</button>
              </div>
              {/* Tab Content */}
              <div>
                {tab === 'details' && (
                  <div className="text-gray-700 text-sm">
                    <h4 className="font-bold mb-2">Product Description</h4>
                    <p>Our organic strawberries are carefully grown without synthetic pesticides or fertilizers, ensuring you get the purest, most natural flavor in every bite. These vibrant red berries are handpicked at peak ripeness to guarantee maximum sweetness and nutritional value.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h5 className="font-semibold mb-1">Benefits</h5>
                        <ul className="list-disc pl-5">
                          <li>Rich in vitamins C and K</li>
                          <li>Good source of fiber and antioxidants</li>
                          <li>Supports heart health</li>
                          <li>Helps regulate blood sugar</li>
                          <li>Promotes healthy skin</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-1">Product Details</h5>
                        <ul className="list-disc pl-5">
                          <li>Origin: California, USA</li>
                          <li>Cultivation: Organic</li>
                          <li>Storage: Refrigerate upon arrival</li>
                          <li>Shelf Life: 5-7 days when refrigerated</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold mb-1">How to Store</h5>
                      <p>For optimal freshness, refrigerate strawberries unwashed in their original container or in a paper towel-lined container. Wash just before eating. To extend shelf life, remove any damaged berries as soon as possible.</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">USDA Organic</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Non-GMO</span>
                    </div>
                  </div>
                )}
                {tab === 'nutrition' && (
                  <div className="text-gray-700 text-sm">Nutrition facts content here...</div>
                )}
                {tab === 'reviews' && (
                  <div className="text-gray-700 text-sm">Reviews content here...</div>
                )}
                {tab === 'shipping' && (
                  <div className="text-gray-700 text-sm">Shipping & returns content here...</div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* You May Also Like */}
        <section className="container mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {suggested.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10" onClick={() => addToWishlist(product)}>
                  <FontAwesomeIcon icon={faHeartRegular} />
                </button>
                <img src={product.imageCover} alt={product.title} className="w-full h-32 object-contain mb-2" />
                <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[36px]">{product.title}</div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                  <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                  <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-green-700 text-base">{product.price} EGP</span>
                  {product.priceAfterDiscount && (
                    <span className="line-through text-gray-400 text-xs">{product.priceAfterDiscount} EGP</span>
                  )}
                </div>
                <button className="mt-auto bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center self-end hover:bg-green-700 transition" onClick={() => addToCart(product)}>
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            ))}
          </div>
        </section>
        {/* Recently Viewed */}
        <section className="container mx-auto mt-12 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Recently Viewed
              <span className="text-base font-normal text-gray-500 ml-2">({recentlyViewed.length} items)</span>
            </h2>
            <button className="text-green-600 text-sm font-semibold" onClick={() => navigate('/Search-products')}>View All</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {recentlyViewed.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10" onClick={() => addToWishlist(product)}>
                  <FontAwesomeIcon icon={faHeartRegular} />
                </button>
                <img src={product.imageCover} alt={product.title} className="w-full h-24 object-contain mb-2" />
                <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                <div className="font-semibold text-xs mb-1 line-clamp-2 min-h-[28px]">{product.title}</div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                  <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-green-700 text-sm">{product.price} EGP</span>
                </div>
                <button className="mt-auto bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center self-end hover:bg-green-700 transition" onClick={() => addToCart(product)}>
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
