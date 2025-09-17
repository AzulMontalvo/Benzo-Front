import { useState } from "react";
import { mockUsers } from "../mockUsers";

function LoginForm({ switchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setError("");
      onLogin(user);
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <form>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Entrar
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        ¿Aún no tienes cuenta?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); switchToRegister(); }}>
          Regístrate
        </a>
      </p>
    </form>
  );
}

function RegisterForm({ switchToLogin, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Agregar usuario al mock
    mockUsers.push({ name, email, password });
    setError("");
    onRegister({ name, email });
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="button" onClick={handleRegister}>
        Registrarse
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        ¿Ya tienes cuenta?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>
          Inicia sesión
        </a>
      </p>
    </form>
  );
}

export default function AuthCard() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);

  if (user) {
    return (
      <div className="login-card">
        <h2>¡Bienvenido, {user.name}!</h2>
        <button onClick={() => setUser(null)}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div className="login-card">
      <h2>{isRegistering ? "Regístrate" : "Iniciar sesión"}</h2>
      {isRegistering ? (
        <RegisterForm
          switchToLogin={() => setIsRegistering(false)}
          onRegister={(u) => setUser(u)}
        />
      ) : (
        <LoginForm
          switchToRegister={() => setIsRegistering(true)}
          onLogin={(u) => setUser(u)}
        />
      )}
    </div>
  );
}
