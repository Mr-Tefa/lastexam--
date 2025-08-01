import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faCheckCircle, faClock, faTimes, faEye, faRedo, faChevronRight, faBoxOpen, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';
import { apiRequest } from "../../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setGuest(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/orders", { token });
      if (data.status === "success") {
        setOrders(data.data || []);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-700 bg-green-100";
      case "processing":
        return "text-blue-700 bg-blue-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  // Timeline for order status
  const OrderTimeline = ({ status }) => {
    const steps = [
      { label: 'Placed', icon: faBoxOpen },
      { label: 'Processing', icon: faClock },
      { label: 'Out for Delivery', icon: faTruck },
      { label: 'Delivered', icon: faCheckCircle },
    ];
    let currentStep = 0;
    if (status === 'processing') currentStep = 1;
    if (status === 'out-for-delivery') currentStep = 2;
    if (status === 'delivered') currentStep = 3;
    return (
      <div className="flex items-center justify-center gap-4 my-6">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center">
            <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-1 text-xl ${idx <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <FontAwesomeIcon icon={step.icon} />
            </div>
            <span className={`text-xs font-semibold ${idx <= currentStep ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</span>
            {idx < steps.length - 1 && <div className={`w-8 h-1 ${idx < currentStep ? 'bg-green-600' : 'bg-gray-200'} mx-auto`}></div>}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center py-20 text-lg font-bold">Loading...</div>;
  if (error) return <div className="text-center py-20 text-lg font-bold text-red-600">{error}</div>;

  if (guest) {
    // Demo order for guests
    return (
      <main className="bg-gray-50 min-h-screen w-full">
        {/* Hero Section */}
        <section className="bg-green-700 text-white py-16 mb-10 text-center">
          <FontAwesomeIcon icon={faTruck} className="text-5xl mb-4" />
          <h1 className="text-4xl font-extrabold mb-2">Track Your Order</h1>
          <p className="text-lg max-w-xl mx-auto">Sign up or log in to see your real orders and track their status in real time. Below is a demo order for preview.</p>
        </section>
        <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
          <section className="flex-1 mx-auto max-w-2xl">
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-2">Demo Order</h2>
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <span className="font-bold text-gray-800">Order #12345</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor('processing')}`}>Processing</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">Placed on 2024-05-01</div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
                <span><b>2</b> items</span>
                <span>Total Amount <b>$199</b></span>
                <span><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> Delivered to <b>Guest Address</b></span>
              </div>
              <OrderTimeline status="processing" />
              <div className="flex gap-2 mb-2 justify-center">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1">
                  <FontAwesomeIcon icon={faTruck} /> Track Order
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1">
                  <FontAwesomeIcon icon={faRedo} /> Reorder
                </button>
              </div>
              <div className="flex gap-2 justify-center">
                <button className="text-green-600 font-semibold text-sm flex items-center gap-1">
                  <FontAwesomeIcon icon={faEye} /> View Details <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button className="text-gray-500 font-semibold text-sm flex items-center gap-1">
                  Write Review
                </button>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <h2 className="text-xl font-bold mb-2 text-green-700">How to Track Your Order?</h2>
              <p className="text-gray-700 mb-2">Sign up or log in to see your real orders and track their status in real time.</p>
              <p className="text-gray-600">For demo purposes, you can see a sample order above.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen w-full">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-16 mb-10 text-center">
        <FontAwesomeIcon icon={faTruck} className="text-5xl mb-4" />
        <h1 className="text-4xl font-extrabold mb-2">My Orders</h1>
        <p className="text-lg max-w-xl mx-auto">Track your orders, view details, and reorder with ease.</p>
      </section>
      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white rounded-xl shadow-lg p-6 mb-8 lg:mb-0 flex flex-col gap-2">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faTruck} className="text-green-600 text-2xl" />
            </div>
            <div className="font-bold text-lg text-gray-800">John Doe</div>
            <div className="text-gray-500 text-sm">john.doe@example.com</div>
          </div>
          <nav className="flex flex-col gap-2">
            <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Dashboard</button>
            <button className="text-left px-4 py-2 rounded-lg font-semibold text-green-700 bg-green-50">Orders</button>
            <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Wishlist</button>
            <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Favorites</button>
            <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Addresses</button>
            <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Payment Methods</button>
            <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Account Details</button>
            <button className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-4 font-semibold">Logout</button>
          </nav>
        </aside>
        {/* Orders Content */}
        <section className="flex-1">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">All Orders</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm">Delivered</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm">Processing</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm">Cancelled</button>
            </div>
            <input type="text" placeholder="Search orders..." className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-64" />
          </div>
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex gap-2">
                    {order.cartItems.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.product.imageCover} alt={item.product.title} className="w-16 h-16 object-cover rounded-lg border" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="font-bold text-gray-800">Order #{order._id.slice(-5)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                      <span><b>{order.cartItems.length}</b> items</span>
                      <span>Total Amount <b>${order.totalOrderPrice}</b></span>
                      <span><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> Delivered to <b>{order.shippingAddress?.details || 'N/A'}</b></span>
                    </div>
                    <OrderTimeline status={order.status} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex gap-2 mb-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1">
                      <FontAwesomeIcon icon={faTruck} /> Track Order
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1">
                      <FontAwesomeIcon icon={faRedo} /> Reorder
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-green-600 font-semibold text-sm flex items-center gap-1">
                      <FontAwesomeIcon icon={faEye} /> View Details <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <button className="text-gray-500 font-semibold text-sm flex items-center gap-1">
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-end mt-8 gap-2">
            <button className="w-8 h-8 rounded bg-green-600 text-white font-bold">1</button>
            <button className="w-8 h-8 rounded bg-gray-200 text-gray-700 font-bold">2</button>
            <button className="w-8 h-8 rounded bg-gray-200 text-gray-700 font-bold">3</button>
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer className="bg-gray-50 border-t pt-8 pb-4 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-2 md:mb-0 font-semibold">FreshCart</div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <span>Fruits & Vegetables</span>
            <span>Dairy & Eggs</span>
            <span>Bakery & Snacks</span>
            <span>Meat & Seafood</span>
            <span>Beverages</span>
          </div>
          <div className="mt-2 md:mt-0">© 2023 FreshCart. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
