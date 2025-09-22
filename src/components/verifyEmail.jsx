//verifyEmail.jsx
import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from '../api/axios';

const CONFIRMEMAIL_URL = 'Account/verify-email';
const RESEND_URL = 'Account/resend-verification';

const VerifyEmail = () => {
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        // Sacar el token de los parámetros de la URL
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            //Si lo encuentra intenta validarlo
            verifyToken(tokenFromUrl);
        } else {
            setErrMsg('No se encontró un token de verificación en la URL.');
        }
    }, [location]);

    const verifyToken = async (token) => {
        try {
            const response = await axios.post(CONFIRMEMAIL_URL, { token },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            console.log(response.data);
            localStorage.removeItem("numControl");
            
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

    const resendVerification = async () => {
        try {

            const numControl = localStorage.getItem("numControl");

            const response = await axios.post(RESEND_URL,
                { numControl }, // el DTO espera NumControl
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            setErrMsg(''); // limpiar errores
            alert(response.data.message); // o un toast bonito
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No hay respuesta del servidor");
            } else {
                setErrMsg(err.response.data?.message || "Error al reenviar correo");
            }
        }
    };

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
                    <button type="button" onClick={resendVerification}>
                        Reenviar correo de verificación
                    </button>

                    <Link to="/register">Regresar</Link>
                </div>
            )}
        </section>
    )
}

export default VerifyEmail;