//loginForm.jsx
import { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from "../context/AuthProvider";
import axios from '../api/axios';


const LOGIN_URL = '/auth/login';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [control, setControl] = useState("");
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [control, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log({ control, pwd });
        setSuccess(true);

        //setSuccess(false); //Reset success state on new submit

        // try {
        //     const response = await axios.post(LOGIN_URL,
        //         JSON.stringify({num_Control: control, contraseña: pwd }),
        //         {
        //             headers: { 'Content-Type': 'application/json' },
        //             withCredentials: true
        //         }
        //     );
        //     console.log(JSON.stringify(response?.data));
        //     //console.log(JSON.stringify(response));
        //     const accessToken = response?.data?.accessToken;
        //     const roles = response?.data?.roles;
        //     setAuth({ control, pwd, roles, accessToken });
        //     setControl('');
        //     setPwd('');
        //     setSuccess(true);
        // } catch (err) {
        //     if (!err?.response) {
        //         setErrMsg('El servidor no responde. Intenta más tarde.');
        //     } else if (err.response?.status === 400) {
        //         setErrMsg('Credenciales inválidas');
        //     } else if (err.response?.status === 401) {
        //         setErrMsg('Unauthorized');
        //     } else {
        //         setErrMsg('El inicio de sesión falló.');
        //     }
        //     errRef.current.focus();
        // }
    }

    return (
        <>
            {success ? (
                <section className="login-card">
                    <h2>Inicio de Sesión Exitoso</h2>
                    <br />
                    <p>
                        <a href="#">Página principal</a>
                    </p>
                </section>
            ) : (
                <section className="login-card">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="control"
                            placeholder='Número de Control'
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setControl(e.target.value)}
                            value={control}
                            required
                        />

                        <input
                            type="password"
                            id="password"
                            placeholder='Contraseña'
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Iniciar Sesión</button>
                    </form>
                    <p>
                        <span className="line">
                            <Link to="/forgotpassword">¿Olvidaste tu contraseña?</Link>
                        </span>
                    </p>
                    <p>
                        ¿Aun no tienes cuenta?<br />
                        <span className="line">
                            <Link to="/register">Regístrate</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login