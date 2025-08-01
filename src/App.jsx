import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout/Layout.jsx"
import Home from "./pages/Home/Home.jsx"
import Categories from "./components/Categories/Categories.jsx"
import Login from "./pages/Login/Login.jsx"
import Signup from "./pages/Signup/Signup.jsx"
import Cart from "./pages/Cart/Cart.jsx"
import WishList from "./pages/WishList/WishList.jsx"
import Favourties from "./pages/Favourties/Favourties.jsx"
import Brands from "./components/Brands/Brands.jsx"
import Offers from "./pages/Offers/Offers.jsx"
import SearchProducts from "./pages/SearchProducts/SearchProducts.jsx"
import ProductDetails from "./pages/ProductDetails/ProductDetails.jsx"
import Checkout from "./pages/Checkout/Checkout.jsx"
import Payment from "./pages/Payment/Payment.jsx"
import Orders from "./pages/Orders/Orders.jsx"
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword.jsx"
import ResetPassword from "./pages/ForgetPassword/ResetPassword.jsx"
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx"
import Account from "./pages/Account/Account.jsx"
import NotFound from "./pages/NotFound/NotFound.jsx"
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import { AppProvider } from "./context/AppContext.jsx";

function App() {
  const router = createBrowserRouter([
{
      path: "/", 
      element: <Layout/>,
      children: [
        {
          index: true, 
          element: <Home />
        },
{
          path: "Login",
          element: <Login/>
},
{
          path: "Signup",
          element: <Signup/>
},
{
          path: "Cart",
          element: <Cart/>
},
{
          path: "WishList",
          element: <WishList/>
},
{
          path: "Favourites",
          element: <Favourties/>
},
{
          path: "Categories",
          element: <Categories/>
},
{
          path: "Brands",
          element: <Brands/>
},
{
          path: "Offers",
          element: <Offers/>
},
{
          path: "Search-products",
          element: <SearchProducts/>
},
{
          path: "Product/:id",
          element: <ProductDetails/>
},
{
          path: "Checkout",
          element: <Checkout/>
},
{
          path: "Payment",
          element: <Payment/>
},
{
          path: "Orders",
          element: <Orders/>
},
{
          path: "ForgetPassword",
          element: <ForgetPassword/>
},
{
          path: "ResetPassword",
          element: <ResetPassword/>
},
{
          path: "VerifyEmail",
          element: <VerifyEmail/>
},
        {
          path: "Account",
          element: <Account/>
        },
        { path: "About", element: <About/> },
        { path: "Contact", element: <Contact/> },
        {
          path: "*",
          element: <NotFound/>
        }
      ]
    }
  ])

  return (
    <AppProvider>
      <RouterProvider router={router}/>
    </AppProvider>
  )
}

export default App
