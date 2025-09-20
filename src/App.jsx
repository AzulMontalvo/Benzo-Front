//App.jsx
import { Routes, Route} from "react-router-dom";
import LoginForm from './components/loginForm.jsx';
import RegisterForm from './components/registerForm.jsx';
import Header from './components/header.jsx';

// export default function App() {
//   return <LoginForm />;
// }

// export default function App() {
//   return <RegisterForm />;
// }

// export default function App() {
//   return <Header />;
// }

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgotpassword" element={<Header />} />
    </Routes>
  );
}

 export default App;