//App.jsx
import { Routes, Route} from "react-router-dom";
import LoginForm from './components/loginForm.jsx';
import RegisterForm from './components/registerForm.jsx';
import ProductosScreen from "./components/ProductosScreen.jsx";


function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/productos" element={<ProductosScreen />} />
    </Routes>
  );
}

 export default App;