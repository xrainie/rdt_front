import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import { Context } from "../common/utils/context";
import { login } from "../api";

const AuthorizationPage = () => {
  const { setIsAuthorized } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    login({email, password}).then((response) => {
      localStorage.setItem("token", response.data.token);
      setIsAuthorized(true);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="authorization-page">
      <div className="authorization-page__block">
        <h3 className="authorization-page__head">Вход в систему</h3>

        <form className="authorization-page__form" onSubmit={handleLogin}>
          <input
            placeholder="Логин"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Пароль"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <NavLink to="/password-recovery">Забыли пароль?</NavLink>

          <button className='outline-button' type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

export { AuthorizationPage }
