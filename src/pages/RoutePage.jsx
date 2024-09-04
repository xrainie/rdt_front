import Select from "react-select";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Context } from "../common/utils/context";

import {getRoute, updateRoute} from "../api";
import mapImg from "../common/images/map2.png";

const selectTypeFilterList = [
  {value: 1, label: "Зигзаг"},
  {value: 2, label: "Спираль"},
  {value: 3, label: "Радиусное обследование"},
]

const selectRangeFilterList = [ ...Array(100).keys() ].map((i) => {
  return ({value: i + 1, label: i + 1});
});

const RoutePage = () => {
  const { id } = useParams();
  const { getRoutesData } = useContext(Context);

  const [route, setRoute] = useState({});
  const [selectedTypeFilter, setSelectedTypeFilter] = useState({});
  const [selectedRangeFilter, setSelectedRangeFilter] = useState({});
  const [selectedFrequencyFilter, setSelectedFrequencyFilter] = useState('');
  const [selectedCountFilter, setSelectedCountFilter] = useState({});
  const [selectedCopterFilter, setSelectedCopterFilter] = useState({});
  const [selectedSettingCopterFilter, setSelectedSettingCopterFilter] = useState({});

  const [routeTitle, setRouteTitle] = useState('');

  const getRouteData = () => {
    getRoute(id).then((response) => {
      setRoute(response.data);
      setSelectedTypeFilter(selectTypeFilterList.filter((el) => el.label === response.data.type_search)[0]);
      setSelectedRangeFilter({value: response.data.scan_range, label: response.data.scan_range});
      setSelectedFrequencyFilter(response.data.scan_frequency);
      setSelectedCountFilter({value: response.data.quadcopters.length, label: response.data.quadcopters.length});
      setSelectedCopterFilter({value: response.data.quadcopters[0]?.id, label: response.data.quadcopters[0]?.name});
      setSelectedSettingCopterFilter({value: response.data.quadcopters[0]?.id, label: response.data.quadcopters[0]?.name});
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getRouteData();
  }, [id]);

  const handleChangeCoordinates = () => {
    console.log(1);
  }

  const getCopter = () => {
    return route.quadcopters?.filter((el) => el.id === selectedSettingCopterFilter.value)[0];
  }

  const handleToggleNoneClass = () => {
    const title = document.getElementById('title');
    const editButton = document.getElementById('title-edit-button');
    const input = document.getElementById('title-input');
    const saveButton = document.getElementById('title-save-button');
    const canselButton = document.getElementById('title-cancel-button');

    title.classList.toggle('none');
    editButton.classList.toggle('none');
    input.classList.toggle('none');
    saveButton.classList.toggle('none');
    canselButton.classList.toggle('none');
  }

  const handleAddEditInput = () => {
    setRouteTitle(route.name);
    handleToggleNoneClass();
  }

  const handleEditRouteTitle = () => {
    updateRoute(id, {name: routeTitle}).then((response) => {
      getRouteData();
      getRoutesData();
      handleToggleNoneClass();
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="route-page page">
      <div className="route-page__title">
        <h1 id="title">{route.name}</h1>
        <button id="title-edit-button" className="route-page__title-edit-button" onClick={() => handleAddEditInput()}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" fill="#999"
               viewBox="0 0 24 24">
            <path
              d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
          </svg>
        </button>

        <input
          className="route-page__title-input none"
          type="text"
          name="title"
          id="title-input"
          value={routeTitle}
          onChange={(e) => setRouteTitle(e.target.value)}
        />
        <button
          id="title-cancel-button"
          className="route-page__title-cancel-button button light-button none"
          onClick={handleToggleNoneClass}
        >
          Отменить
        </button>
        <button
          id="title-save-button"
          className="route-page__title-save-button button light-button none"
          onClick={() => handleEditRouteTitle()}
        >
          Сохранить
        </button>
      </div>

      <div className="route-page__container">
        <img className="route-page__map" src={mapImg} alt="Map"/>

        <div className="route-page__block route-page__info">
          <h5>Информация о выполнении задачи</h5>
          <div className="route-page__info-input">
            <p>Текущее местоположение устройства</p>
            <input type="text"/>
          </div>
          <div className="route-page__info-input">
            <p>Текущее состояние устройства</p>
            <input type="text"/>
          </div>
          <div className="route-page__info-input">
            <p>Состояние оборудования устройства</p>
            <input type="text"/>
          </div>
          <div className="route-page__info-input">
            <p>Заряд батареи, %</p>
            <input type="text"/>
          </div>
          <div className="route-page__info-input">
            <p>Расчетное время работы, мин</p>
            <input type="text"/>
          </div>
          <button className="outline-button route-page__info-button">Просмотр трансляции</button>
        </div>

        <div className="route-page__block route-page__border">
          <div className="route-page__border-haeder">
            <h5>Границы участка обследования</h5>
            <button className="button light-button">Внести изменения в маршрут</button>
          </div>

          <div className="route-page__border-buttons">
            <button className="button light-button">Очистить</button>
            <button className="button light-button">Добавить точку</button>
          </div>

          <div className="route-page__border-points">
            {route?.coordinates?.length > 0 && route.coordinates?.map((el, index) => (
              <div className="route-page__border-point" key={index}>
                <div className="input-with-label">
                  <label htmlFor="point-1">Координаты точки #{index + 1}</label>
                  <input id="point-1" type="text" value={el} onChange={() => handleChangeCoordinates()} />
                </div>
                <button className="button">На карте</button>
                <button className="close-button"/>
              </div>
            ))}
          </div>
        </div>

        <div className="route-page__block new-route-page__additional-settings">
          <div className="new-route-page__additional-settings-header">
            <h5>Дополнительные настройки</h5>
          </div>

          <div className="new-route-page__additional-settings-inputs">
            <div className="new-route-page__additional-settings-input">
              <p>Выбор траектории обследования</p>
              <div className="input-with-label">
                <label htmlFor="trajectory">Траектория</label>
                <Select
                  id="trajectory"
                  options={selectTypeFilterList}
                  isSearchable={false}
                  className="dropdown"
                  classNamePrefix="dropdown"
                  value={selectedTypeFilter}
                  onChange={(el) => setSelectedTypeFilter(el)}
                />
              </div>
            </div>
            <div className="new-route-page__additional-settings-input">
              <p>Количество циклов сканирования</p>
              <div className="input-with-label">
                <label htmlFor="cycles">Циклы</label>
                <Select
                  id="cycles"
                  options={selectRangeFilterList}
                  isSearchable={false}
                  className="dropdown"
                  classNamePrefix="dropdown"
                  value={selectedRangeFilter}
                  onChange={(el) => setSelectedRangeFilter(el)}
                />
              </div>
            </div>
            <div className="new-route-page__additional-settings-input">
              <p>Частота полосы сканирования</p>
              <input type="text" value={selectedFrequencyFilter} onChange={(el) => setSelectedFrequencyFilter(el)} />
            </div>
          </div>

          <div className='checkbox-block'>
            {/*<input type="checkbox" id="checkbox1" checked={checkbox} onChange={() => setCheckbox(!checkbox)} />*/}
            <input type="checkbox" id="checkbox1" checked/>
            <label htmlFor="checkbox1">Разбить участок на несколько обследований</label>
          </div>

          <h6>Выбор устройств</h6>
          <div className="new-route-page__additional-settings-devices">
            <div className="input-with-label">
              <label htmlFor="count">Количество</label>
              <Select
                id="count"
                options={route.quadcopters?.map((el, index) => {
                  return {value: index + 1, label: index + 1}
                })}
                isSearchable={false}
                className="dropdown"
                classNamePrefix="dropdown"
                value={selectedCountFilter}
                onChange={(el) => setSelectedCountFilter(el)}
              />
            </div>
            {[...Array(selectedCountFilter.value)].map((el, index) => (
              <div className="input-with-label" key={index}>
                <label htmlFor="device2">Устройство</label>
                <Select
                  id={`device2-${index+1}`}
                  options={route.quadcopters?.map((el, index) => {
                    return {value: el.id, label: el.name}
                  })}
                  isSearchable={false}
                  className="dropdown"
                  classNamePrefix="dropdown"
                  value={selectedCopterFilter}
                  onChange={(el) => setSelectedCopterFilter(el)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="route-page__block new-route-page__settings">
          <h5>Настройки выбранного устройства</h5>
          <div className="new-route-page__settings-list">
            <div className="input-with-label">
              <label htmlFor="device">Устройство</label>
              <Select
                id="device"
                options={route.quadcopters?.map((el, index) => {
                  return {value: el.id, label: el.name}
                })}
                isSearchable={false}
                className="dropdown"
                classNamePrefix="dropdown"
                value={selectedSettingCopterFilter}
                onChange={(el) => setSelectedSettingCopterFilter(el)}
              />
            </div>
            <button className="button light-button">Добавить канал</button>
            {getCopter()?.channels?.length > 0
              && getCopter()?.channels?.map((el, index) => (
                <div className="input-with-label new-route-page__settings-input" key={el.id}>
                  <label htmlFor="">Канал связи #{index + 1}</label>
                  <input id="search" type="text" value={el.link} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { RoutePage };
