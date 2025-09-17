//App.jsx
import { Routes, Route} from "react-router-dom";
import LoginForm from './components/loginForm.jsx';
import RegisterForm from './components/registerForm.jsx';

// export default function App() {
//   return <LoginForm />;
// }

// export default function App() {
//   return <RegisterForm />;
// }

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

 export default App;