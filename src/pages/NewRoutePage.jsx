import { useEffect, useState } from "react";
import Select from "react-select";

import {addRoute, getQuadcopters, login} from "../api";
import { YMaps, Map, Placemark, Polygon, Clusterer } from '@pbe/react-yandex-maps';

const selectTypeFilterList = [
  {value: 1, label: "Зигзаг"},
  {value: 2, label: "Спираль"},
  {value: 3, label: "Радиусное обследование"},
]

const selectRangeFilterList = [ ...Array(100).keys() ].map((i) => {
  return ({value: i + 1, label: i + 1});
});

const defaultPoint = [55.75399399999374,37.62209300000001];
const defaultPointInputs = [
  {value: "", id: 0},
  {value: "", id: 1},
  {value: "", id: 2}
]

const NewRoutePage = () => {
  const [quadcopters, setQuadcopters] = useState([]);
  const [selectTypeFilter, setSelectedTypeFilter] = useState(selectTypeFilterList[0]);
  const [selectedRangeFilter, setSelectedRangeFilter] = useState({value: 1, label: 1});
  const [selectedFrequencyFilter, setSelectedFrequencyFilter] = useState('');
  const [selectedCopterFilter, setSelectedCopterFilter] = useState({});
  // const [selectedCountFilter, setSelectedCountFilter] = useState({value: 1, label: 1});

  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]);
  const [pointInputs, setPointInputs] = useState(defaultPointInputs);
  const [lastPointIndex, setLastPointIndex] = useState(2);

  useEffect(() => {
    getQuadcopters().then((response) => {
      setQuadcopters(response.data);
      setSelectedCopterFilter((response.data.map((el) => {
        return {value: el.id, label: el.name}
      }))[0]);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const getParams = () => {
    const selectCopter = (quadcopters.filter((el) => el.id === selectedCopterFilter.value))[0];

    return ({
      coordinates: pointInputs
        .filter((el) => el.value !== "")
        .map((el) =>
          Array.isArray(el.value) ? `${el.value[0]}, ${el.value[1]}` : el.value),
      type_search: selectTypeFilter.label,
      scan_range: selectedRangeFilter.label,
      scan_frequency: selectedFrequencyFilter,
      quadcopters: [selectCopter]
    })
  }

  const handleAddRoute = () => {
    addRoute({...getParams()}).then((response) => {
      window.location.href = `/routes/${response.data.id}`;
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleAddPointOnMap= (point) => {
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
    const newPoint = e.get("coords");

    const pointsArray = points;
    const inputsArray = pointInputs;

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

  return (
    <div className="new-route-page page">
      <h1>Создание нового маршрута</h1>

      <div className="new-route-page__container">
        {/*<img className="new-route-page__map" src={mapImg} alt="Map"/>*/}
        <div className="new-route-page__map">
          <YMaps>
            <Map
              width="100%"
              height="100%"
              defaultState={{
                center: defaultPoint,
                zoom: 11,
              }}
              onClick={(e) => handleClickPoint(e)}
              instanceRef={ref => ref && setMap(ref)}
            >
              <Clusterer
                options={{
                  preset: "islands#invertedVioletClusterIcons",
                  groupByCoordinates: false,
                }}
              >
                {points.map((point, index) => (
                  <Placemark key={point.id} geometry={point.value} iconContent={index + 1} />
                ))}
              </Clusterer>

              <Polygon
                geometry={[points.map((point) => point.value)]}
                options={{
                  fillColor: "rgba(183,127,127,0.4)",
                  strokeColor: "#cb0000",
                  opacity: 0.5,
                }}
              />
            </Map>
          </YMaps>
        </div>

        <div className="new-route-page__block new-route-page__borders">
          <h5>Границы участка обследования</h5>
          <div className="new-route-page__borders-buttons">
            <button className="button light-button" onClick={() => handleClearPoints()}>Очистить</button>
            <button className="button light-button" onClick={() => handleAddPointInput()}>Добавить точку</button>
          </div>
          <div className="new-route-page__borders-points">
            {pointInputs.map((point, index) => (
              <div className="new-route-page__borders-point" key={point.id}>
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
                <button className="close-button" onClick={() => handleDeletePoint(point)} />
              </div>
            ))}
          </div>
        </div>

        <div className="new-route-page__block new-route-page__additional-settings">
          <div className="new-route-page__additional-settings-header">
            <h5>Дополнительные настройки</h5>
            <p>*Используется авторская настройка</p>
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
                  value={selectTypeFilter}
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
          {/*  <input type="checkbox" id="checkbox1" checked onChange={() => null}/>*/}
          {/*  <label htmlFor="checkbox1">Разбить участок на несколько обследований</label>*/}
          {/*</div>*/}
          {/**/}
          {/*<h6>Выбор устройств</h6>*/}
          {/*<div className="new-route-page__additional-settings-devices">*/}
          {/*  <div className="input-with-label">*/}
          {/*  <label htmlFor="count">Количество</label>*/}
          {/*  <Select*/}
          {/*    id="count"*/}
          {/*    options={quadcopters?.map((el, index) => {*/}
          {/*      return {value: index + 1, label: index + 1}*/}
          {/*    })}*/}
          {/*    isSearchable={false}*/}
          {/*    className="dropdown"*/}
          {/*    classNamePrefix="dropdown"*/}
          {/*    value={selectedCountFilter}*/}
          {/*    onChange={(el) => setSelectedCountFilter(el)}*/}
          {/*  />*/}
          {/*  </div>*/}
          {/*  <div className="input-with-label">*/}
          {/*    <label htmlFor="device2">Устройство</label>*/}
          {/*    <Select*/}
          {/*      id="device"*/}
          {/*      options={quadcopters.map((el) => {*/}
          {/*        return {value: el.id, label: el.name}*/}
          {/*      })}*/}
          {/*      isSearchable={false}*/}
          {/*      className="dropdown"*/}
          {/*      classNamePrefix="dropdown"*/}
          {/*      value={selectedCopterFilter}*/}
          {/*      onChange={(el) => setSelectedCopterFilter(el)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        <div className="new-route-page__block new-route-page__settings">
          <h5>Настройки выбранного устройства</h5>
          <div className="new-route-page__settings-list">
            <div className="input-with-label">
              <label htmlFor="device">Устройство</label>
              <Select
                id="device"
                options={quadcopters.map((el) => {
                  return {value: el.id, label: el.name}
                })}
                isSearchable={false}
                className="dropdown"
                classNamePrefix="dropdown"
                value={selectedCopterFilter}
                onChange={(el) => setSelectedCopterFilter(el)}
              />
            </div>
            {/*<button className="button light-button">Добавить канал</button>*/}
            {/*<div className="input-with-label new-route-page__settings-input">*/}
            {/*  <label htmlFor="">Канал связи #1</label>*/}
            {/*  <input id="search" type="text"/>*/}
            {/*</div>*/}
            {/*<div className="input-with-label new-route-page__settings-input">*/}
            {/*  <label htmlFor="">Канал связи #2</label>*/}
            {/*  <input id="search" type="text"/>*/}
            {/*</div>*/}
          </div>

          <button
            className="outline-button red new-route-page__settings-button"
            onClick={() => handleAddRoute()}
          >
            Старт маршрута
          </button>
        </div>
      </div>
    </div>
  )
}

export {NewRoutePage}
