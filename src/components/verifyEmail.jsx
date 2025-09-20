//verifyEmail.jsx
import { useRef, useState, useEffect } from "react";
import {Link} from "react-router-dom";
import axios from '../api/axios';

const CONFIRMEMAIL_URL = 'account/verify-email';

const VerifyEmail = () => {
    const userRef = useRef();
    const errRef = useRef();
    //const [token, setToken] = useState("");
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token'); // Obtiene el valor del parámetro 'token'
        if (tokenFromUrl) {

            verifyToken(tokenFromUrl);
        } else {
            setErrMsg('No se encontró un token de verificación en la URL.');
        }
    }, [location]);

    const verifyToken = async (token) => {
        try {
            const response = await axios.get(`${CONFIRMEMAIL_URL}?token=${token}`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response.data);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No hay respuesta del servidor');
            } else if (err.response?.status === 400) {
                setErrMsg('Token inválido o expirado');
            } else if (err.response?.status === 401) {
                setErrMsg('No autorizado');
            } else {
                setErrMsg('Fallo la verificación');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className="login-card">
            <h1>Verificación de Correo Electrónico</h1>
            {success ? (
                <div>
                    <p>¡Tu correo electrónico ha sido verificado exitosamente!</p>
                    <Link to="/login">Inicia Sesión</Link>
                </div>
            ) : (
                <div>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <p>Si el token no se validó automáticamente, asegúrate de que la URL sea correcta o solicita un nuevo enlace de verificación.</p>
                    <Link to="/login">Inicia Sesión</Link>
                </div>
            )}
        </section>
    )
}

export default VerifyEmail;