import Select from "react-select";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Context } from "../common/utils/context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {getRoute, getRouteJson, login, updateRoute} from "../api";
import { Clusterer, Map, Placemark, Polygon, Polyline, YMaps } from "@pbe/react-yandex-maps";

const selectTypeFilterList = [
  {value: 1, label: "Зигзаг"},
  {value: 2, label: "Спираль"},
  {value: 3, label: "Радиусное обследование"},
]

const selectRangeFilterList = [ ...Array(100).keys() ].map((i) => {
  return ({value: i + 1, label: i + 1});
});

const defaultPoint = [55.75399399999374,37.62209300000001];

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
  const [lastPointIndex, setLastPointIndex] = useState(0);

  const [routeTitle, setRouteTitle] = useState('');

  const [pointInputs, setPointInputs] = useState([]);
  const [points, setPoints] = useState([]);
  const [map, setMap] = useState(null);
  const [ymaps, setYmaps] = useState(null);

  const [jsonLink, setJsonLink] = useState('');
  const [copterRoute, setCopterRoute] = useState([]);
  const [isPolygonCentreMode, setIsPolygonCentreMode] = useState(true);

  const getRouteData = () => {
    getRoute(id).then((response) => {
      setRoute(response.data);
      setSelectedTypeFilter(selectTypeFilterList.filter((el) => el.label === response.data.type_search)[0]);
      setSelectedRangeFilter({value: response.data.scan_range, label: response.data.scan_range});
      setSelectedFrequencyFilter(response.data.scan_frequency);
      setSelectedCountFilter({value: response.data.quadcopters.length, label: response.data.quadcopters.length});
      setSelectedCopterFilter({value: response.data.quadcopters[0]?.id, label: response.data.quadcopters[0]?.name});
      setSelectedSettingCopterFilter({value: response.data.quadcopters[0]?.id, label: response.data.quadcopters[0]?.name});
      setPointInputs(response.data.coordinates.map((el, index) => {
        return {id: index, value: el.split(',').map((el, index) => Number(el))}
      }));
      setPoints(response.data.coordinates.map((el, index) => {
        return {id: index, value: el.split(',').map((el, index) => Number(el))}
      }));
      setLastPointIndex(response.data.coordinates.length);
    }).catch((error) => {
      console.log(error);
    });
  }

  const notify = () => toast("Маршрут слишком длинный");

  const getRouteJsonData = () => {
    getRouteJson({route_id: id}).then((response) => {
      setJsonLink(response.data.full_path_url)
      setCopterRoute(response.data.path_vertices);
      if (!Array.isArray(response.data.path_vertices)) {
        notify();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getRouteJsonData();
    getRouteData();
    setIsPolygonCentreMode(true);
  }, [id]);

  const setCenter = (ref) => {
    if (ymaps && isPolygonCentreMode) {
      const map = ref.getMap();
      if (!!ref.geometry && !!ref.geometry.getBounds()) {
        const result = ymaps.util.bounds.getCenterAndZoom(
          ref?.geometry?.getBounds(),
          map?.container?.getSize()
        );
        map.setCenter(result.center, result.zoom - 1);
      }
    }
  }

  const getParams = () => {
    return ({
      coordinates: pointInputs
        .filter((el) => el.value !== "")
        .map((el) =>
          Array.isArray(el.value) ? `${el.value[0]}, ${el.value[1]}` : el.value),
      type_search: selectedTypeFilter.label,
      scan_range: selectedRangeFilter.label,
      scan_frequency: selectedFrequencyFilter,
    })
  }

  const handleUpdateRoute = () => {
    updateRoute(id, {...getParams()}).then((response) => {
      getRouteData();
    }).catch((error) => {
      console.log(error);
    });
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

  const handleAddPointOnMap= (point) => {
    setIsPolygonCentreMode(false);

    if (point.value !== '') {
      let pointsArray = points;
      let newPointValue = Array.isArray(point.value)
        ? point.value
        : point.value.split(',').map((el, index) => Number(el));

      if (pointsArray.some((el, index) => el.id === point.id)) {
        const elIndex = pointsArray.findIndex((el) => el.id === point.id);
        pointsArray.splice(elIndex, 1, {value: newPointValue, id: point.id})
        setPoints([...pointsArray]);
      } else {
        pointsArray.push({value: newPointValue, id: point.id});
        setPoints([...pointsArray]);
      }

      map.setCenter(newPointValue);
    }
  }

  const handleClickPoint = (e) => {
    setIsPolygonCentreMode(false);

    const newPoint = e.get("coords");

    const pointsArray = points;
    const inputsArray = pointInputs;

    console.log(pointsArray)
    console.log(inputsArray)
    if (inputsArray.some((el) => el.value === '')) {
      const indexInput = inputsArray.findIndex((el) => el.value === '');
      const inputId = inputsArray[indexInput].id;
      inputsArray[indexInput] = {value: newPoint, id: inputId}
      setPointInputs([...inputsArray]);

      pointsArray.push({value: newPoint, id: inputId});
      setPoints([...pointsArray]);
    } else {
      pointsArray.push({value: newPoint, id: lastPointIndex + 1});
      setPoints([...pointsArray]);

      inputsArray.push({value: newPoint, id: lastPointIndex + 1});
      setPointInputs([...inputsArray])

      setLastPointIndex(lastPointIndex + 1);
    }
  }

  const handleChangePointValue = (e, point) => {
    let array = pointInputs;
    const elIndex = array.findIndex((el) => el.id === point.id);
    array.splice(elIndex, 1, {value: e.target.value, id: point.id})
    setPointInputs([...array]);
  }

  const handleAddPointInput = () => {
    let array = pointInputs;
    array.push({value: '', id: lastPointIndex + 1});
    setLastPointIndex(lastPointIndex + 1);
    setPointInputs([...array]);
  }

  const handleClearPoints = () => {
    setPointInputs([
      {value: "", id: 0},
      {value: "", id: 1},
      {value: "", id: 2}
    ]);
    setPoints([]);
    setLastPointIndex(2);
    map.setCenter(defaultPoint);
  }

  const handleDeletePoint = (point) => {
    if (pointInputs.length > 3) {
      const newPointInputsArray = pointInputs.filter((el) => el.id !== point.id);
      setPointInputs([...newPointInputsArray])

      const newPointsArray = points.filter((el) => el.id !== point.id);
      setPoints([...newPointsArray])
    }
  }

  const handleGetData = () => {
    fetch(jsonLink)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "route.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error);
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
        {/*<img className="route-page__map" src={mapImg} alt="Map"/>*/}
        <div className="route-page__map">
          <YMaps query={{ lang: "ru_RU", load: "util.bounds", apikey: "465585cc-2266-4967-bf69-e921eb7856e8" }}>
            <Map
              width="100%"
              height="100%"
              defaultState={{
                center: defaultPoint,
                zoom: 11,
              }}
              onLoad={ymaps => setYmaps(ymaps)}
              instanceRef={ref => ref && setMap(ref)}
              onClick={(e) => handleClickPoint(e)}
            >
              <Clusterer>
                {points.map((point, index) => (
                  <Placemark key={point.value} geometry={point.value} iconContent={index + 1} />
                ))}
              </Clusterer>

              <Polygon
                geometry={[points.filter((el, index) => index !== 0).map((point) => point.value)]}
                options={{
                  fillColor: "rgba(183,127,127,0.25)",
                  strokeColor: "#de4d4d",
                }}
                instanceRef={ref => ref && setCenter(ref)}
              />

              <Polyline
                geometry={copterRoute}
                options={{
                  balloonCloseButton: false,
                  strokeColor: "#545454",
                  strokeWidth: 1,
                }}
              />
            </Map>
          </YMaps>
        </div>

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
            <button className="button light-button" onClick={() => handleUpdateRoute()}>Внести изменения в маршрут</button>
          </div>

          <div className="route-page__border-buttons">
            <button className="button light-button" onClick={() => handleClearPoints()}>Очистить</button>
            <button className="button light-button" onClick={() => handleAddPointInput()}>Добавить точку</button>
            <button className="button light-button" onClick={() => handleGetData()}>Данные о маршруте</button>
          </div>

          <div className="route-page__border-points">
            {pointInputs?.map((point, index) => (
              <div className="route-page__border-point" key={point.id}>
                <div className="input-with-label">
                  <label htmlFor={`point-${index + 1}`}>Координаты точки #{index + 1}</label>
                  <input
                    id={`point-${index + 1}`}
                    type="text"
                    value={point.value}
                    onChange={(e) => handleChangePointValue(e, point)}
                  />
                </div>
                <button className="button" onClick={() => handleAddPointOnMap(point)}>На карте</button>
                <button className="close-button" onClick={() => handleDeletePoint(point)}/>
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
              <input
                type="text"
                value={selectedFrequencyFilter}
                onChange={(e) => setSelectedFrequencyFilter(e.target.value)}
              />
            </div>
          </div>

          {/*<div className='checkbox-block'>*/}
          {/*  <input type="checkbox" id="checkbox1" checked onChange={() => console.log("") }/>*/}
          {/*  <label htmlFor="checkbox1">Разбить участок на несколько обследований</label>*/}
          {/*</div>*/}
          {/**/}
          {/*<h6>Выбор устройств</h6>*/}
          {/*<div className="new-route-page__additional-settings-devices">*/}
          {/*  <div className="input-with-label">*/}
          {/*    <label htmlFor="count">Количество</label>*/}
          {/*    <Select*/}
          {/*      id="count"*/}
          {/*      options={route.quadcopters?.map((el, index) => {*/}
          {/*        return {value: index + 1, label: index + 1}*/}
          {/*      })}*/}
          {/*      isSearchable={false}*/}
          {/*      className="dropdown"*/}
          {/*      classNamePrefix="dropdown"*/}
          {/*      value={selectedCountFilter}*/}
          {/*      onChange={(el) => setSelectedCountFilter(el)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  {[...Array(selectedCountFilter.value)].map((el, index) => (*/}
          {/*    <div className="input-with-label" key={index}>*/}
          {/*      <label htmlFor="device2">Устройство</label>*/}
          {/*      <Select*/}
          {/*        id={`device2-${index+1}`}*/}
          {/*        options={route.quadcopters?.map((el, index) => {*/}
          {/*          return {value: el.id, label: el.name}*/}
          {/*        })}*/}
          {/*        isSearchable={false}*/}
          {/*        className="dropdown"*/}
          {/*        classNamePrefix="dropdown"*/}
          {/*        value={selectedCopterFilter}*/}
          {/*        onChange={(el) => setSelectedCopterFilter(el)}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
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
            {/*<button className="button light-button">Добавить канал</button>*/}
            {/*{getCopter()?.channels?.length > 0*/}
            {/*  && getCopter()?.channels?.map((el, index) => (*/}
            {/*    <div className="input-with-label new-route-page__settings-input" key={el.id}>*/}
            {/*      <label htmlFor="">Канал связи #{index + 1}</label>*/}
            {/*      <input id="search" type="text" value={el.link} onChange={() => console.log("")} />*/}
            {/*    </div>*/}
            {/*  )*/}
            {/*)}*/}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export { RoutePage };
