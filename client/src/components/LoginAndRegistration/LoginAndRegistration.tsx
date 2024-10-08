import { SubmitHandler, useForm } from "react-hook-form"
import { FC, useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "../../API/loginApi"
import logo from "../../assets/logo.svg"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import validator from "validator"

export const Registration: FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginAndRegistrationInputs>()
    const [usernameLengthError, setUsernameLengthError] = useState("")
    const [passwordLengthError, setPasswordLengthError] = useState("")
    const [passwordConfirmError, setPasswordConfirmError] = useState("")
    const [serverError, setServerError] = useState("")
    const [registerUser] = useRegisterUserMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("user") && location.pathname === "/registration") {
            navigate("/")
        }
    })

    const onSubmit: SubmitHandler<LoginAndRegistrationInputs> = async ({ username, password }) => {
        const registrationData = { name: username, password: password }
        const response = await registerUser(registrationData)
        if (response.error && "status" in response.error) {
            if (response.error.status == 400 && typeof response.error.data === "string") {
                setServerError(response.error.data)
            } else if (response.error.status == 500) {
                setServerError("Some server error occurred")
            }
        } else {
            localStorage.setItem("user", JSON.stringify(response.data))
            window.location.reload()
        }
    }

    watch((data) => {
        if (data.username!.length < 2) {
            setUsernameLengthError("Minimum length is 2")
        } else if (data.username!.length > 30) {
            setUsernameLengthError("Maximum length is 30")
        } else {
            setUsernameLengthError("")
            setServerError("")
        }

        if (data.password!.length < 8 && data.password!.length > 0) {
            setPasswordLengthError("Minimum length is 8")
        } else if (data.password!.length > 1024) {
            setPasswordLengthError("Maximum length is 1024")
        } else if (!validator.isStrongPassword(data.password!, { minSymbols: 0 }) && data.password!.length > 0) {
            setPasswordLengthError("Password is not strong enough")
        } else {
            setPasswordLengthError("")
        }

        if (data.password !== data.confirmPassword) {
            setPasswordConfirmError("Password mismatch")
        } else {
            setPasswordConfirmError("")
        }
    })

    return (
        <div className={"login-page"}>
            <div className={"login-block"}>
                <img src={logo} alt={"logo"} />
                <h1>Sign up to Blok</h1>
                <div className={"login-page-form-block"}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <span>Create username</span>
                            <input className={(errors.username || usernameLengthError || serverError) && "error-input"} {...register("username", { required: true })} />
                            {(errors.username && <span className={"error-text"}>This field is required</span>) ||
                                (usernameLengthError && <span className={"error-text"}>{usernameLengthError}</span>) ||
                                (serverError && <span className={"error-text"}>{serverError}</span>)}
                        </div>
                        <div>
                            <span>Create password</span>
                            <input className={(errors.password || passwordLengthError || serverError) && "error-input"} {...register("password", { required: true })} />
                            {(errors.password && <span className={"error-text"}>This field is required</span>) || (passwordLengthError && <span className={"error-text"}>{passwordLengthError}</span>)}
                        </div>
                        <div>
                            <span>Confirm password</span>
                            <input className={(errors.confirmPassword || passwordConfirmError || serverError) && "error-input"} {...register("confirmPassword", { required: true })} />
                            {(errors.password && <span className={"error-text"}>This field is required</span>) || (passwordConfirmError && <span className={"error-text"}>{passwordConfirmError}</span>)}
                        </div>
                        <button>Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const Login: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginAndRegistrationInputs>()
    const [serverError, setServerError] = useState("")
    const [loginUser] = useLoginUserMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("user") && location.pathname === "/login") {
            navigate("/")
        }
    })

    const onSubmit: SubmitHandler<LoginAndRegistrationInputs> = async ({ username, password }) => {
        const loginData = { name: username, password: password }
        const response = await loginUser(loginData)
        if (response.error && "status" in response.error) {
            if (response.error.status == 400 && typeof response.error.data === "string") {
                setServerError(response.error.data)
            } else if (response.error.status == 500) {
                setServerError("Some server error occurred")
            }
        } else {
            localStorage.setItem("user", JSON.stringify(response.data))
            window.location.reload()
        }
    }

    return (
        <div className={"login-page"}>
            <div className={"login-block"}>
                <img src={logo} alt={"logo"} />
                <h1>Sign in to Blok</h1>
                <div className={"login-page-form-block"}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <span>Username</span>
                            <input className={(errors.username || serverError) && "error-input"} {...register("username", { required: true })} />
                            {(serverError && <span className={"error-text"}>{serverError}</span>) || (errors.username && <span className={"error-text"}>This field is required</span>)}
                        </div>
                        <div>
                            <span>Password</span>
                            <input className={(errors.password || serverError) && "error-input"} {...register("password", { required: true })} />
                            {errors.password && <span className={"error-text"}>This field is required</span>}
                        </div>
                        <button>Sign in</button>
                        <span>
                            Not registered yet? <Link to={"/registration"}>Create an account</Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    )
}
