import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

// Cambiar la URL cuando se tenga el backend
const FORGOT_PASSWORD_URL = '/auth/forgot-password';

const ForgotPassword = () => {
    const controlRef = useRef();
    const errRef = useRef();

    const [control, setControl] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        controlRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [control])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const CTRL_REGEX = /^[0-9]{8}$/;
        // if (!CTRL_REGEX.test(control)) {
        //     setErrMsg('El número de control debe ser de 8 dígitos numéricos.');
        //     return;
        // }

        try {
            // endpoint del backend
            // const response = await axios.post(FORGOT_PASSWORD_URL,
            //     JSON.stringify({ num_Control: control }),
            //     {
            //         headers: { 'Content-Type': 'application/json' },
            //         withCredentials: true
            //     }
            // );
            // console.log(response?.data);
            setSuccess(true);
            setControl('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El servidor no responde. Intenta más tarde.');
            } else if (err.response?.status === 400) {
                setErrMsg('Número de control no válido o no registrado.');
            } else {
                setErrMsg('Ocurrió un error. Inténtalo de nuevo más tarde.');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className="login-card">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>¿Olvidaste tu Contraseña?</h2>
            {success ? (
                <div>
                    <p>Se ha enviado un correo con las instrucciones para restablecer tu contraseña a tu correo institucional.</p>
                    <p>
                        <span className="line">
                            <Link to="/login">Volver al Inicio de Sesión</Link>
                        </span>
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="control"
                        placeholder='Número de Control'
                        ref={controlRef}
                        autoComplete="off"
                        onChange={(e) => setControl(e.target.value)}
                        value={control}
                        required
                    />
                    <button>Enviar Correo de Reestablecimiento</button>
                    <p>
                        <span className="line">
                            <Link to="/login">Volver al Inicio de Sesión</Link>
                        </span>
                    </p>
                </form>
            )}
        </section>
    )
}

export default ForgotPassword;