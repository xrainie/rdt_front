import { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";

import { getArchive } from "../api";
import mapImg from "../common/images/map4.png";

const ArchivePage = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [archive, setArchive] = useState(false);

  useEffect(() => {
    getArchive().then((response) => {
      setArchive(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [])

  return (
    <div className="archive-page page">
      <h1>История обследований</h1>

      <div className="archive-page__header">
        <div className="archive-page__filter">
          <p>Поиск по дате</p>
          <Select
            id="trajectory"
            isSearchable={false}
            className="dropdown"
            classNamePrefix="dropdown"
          />
          <span>—</span>
          <Select
            id="trajectory"
            isSearchable={false}
            className="dropdown"
            classNamePrefix="dropdown"
          />
          <button className="button light-button">Поиск</button>
        </div>

        <button className="button light-button">Сформировать отчет</button>
      </div>

      <div className="archive-page__container">
        {archive.length > 0 && archive.map((el, index) => (
          <Fragment key={el.id}>
            <div
              className={`archive-page__dropdown${isOpenDropdown ? ' isOpen' : ''}`}
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
            >
              27.05.2024
            </div>
            <div className={`archive-page__table${isOpenDropdown ? ' isOpen' : ''}`}>
              <div className="archive-page__table-header">
                <div className="archive-page__table-row">
                  <div>Маршрут</div>
                  <div>Обследованная область</div>
                  <div>Координаты граничных точек</div>
                  <div>Обнаружено объектов</div>
                  <div>Статус задачи</div>
                  <div>Авторская настройка</div>
                  <div>Перейти к отчету</div>
                </div>
              </div>
              <div className="archive-page__table-body">
                <div className="archive-page__table-row">
                  <div>Маршрут 1</div>
                  <div>
                    <img src={mapImg} alt="Map"/>
                  </div>
                  <div>
                    123.123.456.78<br/>123.123.456.78
                  </div>
                  <div>60</div>
                  <div>Выполнена</div>
                  <div>Да</div>
                  <div>
                    <NavLink to='/archive/report/1'>Перейти к отчету</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export {ArchivePage};