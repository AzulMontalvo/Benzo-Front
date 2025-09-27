//App.jsx
import { Routes, Route} from "react-router-dom";
import LoginForm from './components/loginForm.jsx';
import RegisterForm from './components/registerForm.jsx';
import ProductosScreen from "./components/ProductosScreen.jsx";
import ForgotPassword from "./components/forgotPassword.jsx";
import Header from "./components/Header/header.jsx";
import VerifyEmail from "./components/verifyEmail.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import Checkout from "./components/checkout.jsx";


// export default function App() {
//   return <Header />;
// }

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/productos" element={<ProductosScreen />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

 export default App;