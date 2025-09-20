//registerForm.jsx
import { useRef, useState, useEffect } from "react";
import {Link} from "react-router-dom";
//import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from '../api/axios';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const CTRL_REGEX = /^[0-9]{8}$/;
//Cambiar la URL cuando se tenga el backend
const REGISTER_URL = '/Auth/register';
const CONFIRM_URL = '/Account/confirm-email';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [control, setControl] = useState("");
    const [validControl, setValidControl] = useState(false);
    const [controlFocus, setControlFocus] = useState(false);

    const [nombre, setNombre] = useState("");
    const [nombreFocus, setNombreFocus] = useState(false);

    const [apellido, setApellido] = useState("");
    const [apellidoFocus, setApellidoFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [email, setEmail] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidControl(CTRL_REGEX.test(control));
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [control, pwd, matchPwd])

    //Validaciones de error
    useEffect(() => {
        setErrMsg('');
    }, [control, pwd, matchPwd])

    // Generar el email institucional cuando cambia el número de control
    // useEffect(() => {
    //     if (control) {
    //         setEmail(`L${control}@delicias.tecnm.mx`);
    //     } else {
    //         setEmail("");
    //     }
    // }, [control]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = CTRL_REGEX.test(control);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        // console.log({ control, nombre, apellido, pwd });
        // setSuccess(true);

        //HandleSubmit Function
         try {
             const response = await axios.post(REGISTER_URL,
                 JSON.stringify({ numControl: control, nombre: nombre, apellido: apellido, password: pwd}),
                 {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //Limpiar Inputs
            setControl('');
            setNombre('');
            setApellido('');
            setPwd('');
            setMatchPwd('');
            // setEmail('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El servidor no responde. Intenta más tarde.');
            // } else if (err.response?.status === 409) {
            //     setErrMsg('Usuario ya registrado');
            } else {
                setErrMsg('El registro falló. Inténtelo de nuevo más tarde.');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section className="login-card" >
                    <h2>¡Registro Exitoso!</h2>
                    <p>Se ha enviado un enlace de verificación a su correo institucional ({email}). Revise su bandeja de entrada.
                    </p>
                </section>
            ) : (
                <section className="login-card">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h2>Regístrate</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Número de Control"
                            id="control"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setControl(e.target.value)}
                            value={control}
                            required
                            aria-invalid={validControl ? "false" : "true"}
                            aria-describedby="ctrlnote"
                            onFocus={() => setControlFocus(true)}
                            onBlur={() => setControlFocus(false)}
                        />
                        <p id="ctrlnote" className={controlFocus && !validControl ? "alerta" : "offscreen"}>
                            Ingresa solo 8 caracteres, no incluyas letras.<br />
                        </p>

                        <input
                            type="text"
                            placeholder="Nombre"
                            id="nombre"
                            autoComplete="off"
                            onChange={(e) => setNombre(e.target.value)}
                            value={nombre}
                            required
                            onFocus={() => setNombreFocus(true)}
                            onBlur={() => setNombreFocus(false)}
                        />

                        <input
                            type="text"
                            placeholder="Apellido"
                            id="apellido"
                            autoComplete="off"
                            onChange={(e) => setApellido(e.target.value)}
                            value={apellido}
                            required
                            onFocus={() => setApellidoFocus(true)}
                            onBlur={() => setApellidoFocus(false)}
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "alerta" : "offscreen"}>
                            8 a 24 caracteres<br />
                            Debe contener una minúscula, una mayúscula, y un número.<br />
                        </p>
                        <input
                            type="password"
                            placeholder="Confirmar Contraseña"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "alerta" : "offscreen"}>
                            Las contraseñas deben coincidir.
                        </p>

                        <button disabled={!validControl || !validPwd || !validMatch ? true : false}>
                            Registrarse
                        </button>
                    </form>
                    <p>
                        ¿Ya tienes cuenta?<br />
                        <span className="line">
                            <Link to="/login">Inicia Sesión</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register