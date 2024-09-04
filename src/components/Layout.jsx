import { Fragment, useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Context } from "../common/utils/context";
import { getRoutes } from "../api";
import logo from "../common/images/logo.svg";

const Layout = () => {
  const { setIsAuthorized, isOpenRouteDropdown, setIsOpenRouteDropdown, routes } = useContext(Context);
  const navigate = useNavigate();

  const [isOpenSettingDropdown, setIsOpenSettingDropdown] = useState(false);
  // const [isOpenArchiveDropdown, setIsOpenArchiveDropdown] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuthorized(false);
    navigate("/auth");
  };

  return (
    <>
      <aside className="aside">
        <NavLink className="aside__logo" to={`/`}>
          <img src={logo} alt="Logo"/>
        </NavLink>

        <div className="aside__menu">
          <NavLink className="aside__menu-link" to={`/`}>Главная</NavLink>
          <NavLink className="aside__menu-link" to={`/new-route`}>Новый маршрут</NavLink>

          <span
            className={`aside__menu-link aside__menu-dropdown-button${isOpenRouteDropdown ? " isOpen" : ""}`}
            onClick={() => setIsOpenRouteDropdown(!isOpenRouteDropdown)}
          >
            Все маршруты
          </span>
          <div className={`aside__menu-dropdown${isOpenRouteDropdown ? " isOpen" : ""}`}>
            {routes.length > 0 && routes.map((route, index) => (
              <NavLink to={`/routes/${route.id}`} key={route.id} className="aside__menu-link">
                {route.name}
              </NavLink>
            ))}
          </div>

          <NavLink className="aside__menu-link" to={`/archive`}>Архив</NavLink>

          <span
            className={`aside__menu-link aside__menu-dropdown-button${isOpenSettingDropdown ? " isOpen" : ""}`}
            onClick={() => setIsOpenSettingDropdown(!isOpenSettingDropdown)}
          >
            Настройки
          </span>
          <div className={`aside__menu-dropdown${isOpenSettingDropdown ? " isOpen" : ""}`}>
            <NavLink to={`/quadcopters`} className="aside__menu-link">
              Оборудования и устройства
            </NavLink>
            <NavLink to={`/detection-setting`} className="aside__menu-link">
              Обнаружение объектов
            </NavLink>
            <NavLink to={`/errors`} className="aside__menu-link">
              Отчет об ошибках
            </NavLink>
          </div>
        </div>

        <div className="aside__footer">
          <p>Иванов Иван</p>
          <a href="/" onClick={handleLogout}>Выйти</a>
        </div>
      </aside>

      <Outlet/>
    </>
  )
}

export {Layout}
