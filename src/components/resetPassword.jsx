import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../api/axios";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const RESET_PASSWORD_URL = "Account/reset-password";

const ResetPassword = () => {
  const errRef = useRef();
  const location = useLocation();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);


  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);


  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) setToken(tokenFromUrl);
    else setErrMsg("No se encontró el token de restablecimiento en la URL.");
  }, [location]);

    useEffect(() => {
        setValidNewPassword(PWD_REGEX.test(newPassword));
        setValidConfirmPassword(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        RESET_PASSWORD_URL,
        { token, newPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("El servidor no responde. Intenta más tarde.");
      } else if (err.response?.status === 400) {
        setErrMsg("Token inválido o expirado.");
      } else {
        setErrMsg("Ocurrió un error. Inténtalo de nuevo.");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="login-card">
      <h2>Restablecer Contraseña</h2>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
        {errMsg}
      </p>

      {success ? (
        <div>
          <p>Tu contraseña ha sido restablecida exitosamente.</p>
          <Link to="/login">Inicia Sesión</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            aria-invalid={validNewPassword ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setNewPasswordFocus(true)}
            onBlur={() => setNewPasswordFocus(false)}
          />
          <p id="pwdnote" className={newPasswordFocus && !validNewPassword ? "alerta" : "offscreen"}>
                8 a 24 caracteres<br />
                Debe contener una minúscula, una mayúscula, y un número.<br />
          </p>
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-invalid={validConfirmPassword ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setConfirmFocus(true)}
            onBlur={() => setConfirmFocus(false)}
          />
          <p id="confirmnote" className={confirmFocus && !validConfirmPassword ? "alerta" : "offscreen"}>
                Las contraseñas deben coincidir.
          </p>
          <button disabled={!validNewPassword || !validConfirmPassword ? true : false}>
            Restablecer
          </button>
        </form>
      )}
    </section>
  );
};

export default ResetPassword;
