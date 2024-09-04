import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import { getRoutes } from "../api";
import mapImg from "../common/images/map.png"

const selectList = [
  {value: 'date', label: "Дате"},
  {value: 'route', label: "Маршруту"},
  {value: 'status', label: "Статусу"},
]

const HomePage = () => {
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState(selectList[0]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState({});

  useEffect(() => {
    getRoutes({sort_by: selectedFilter.value}).then((response) => {
      setRoutes(response.data);
      setSelectedRoute(response.data[0]);
    }).catch((error) => {
      console.log(error);
    });
  }, [selectedFilter]);

  const changeSelectedRoute = (selectedRoute) => {
    if (selectedRoute.status === "Активно") {
      navigate(`/routes/${selectedRoute.id}`);
    } else {
      setSelectedRoute(selectedRoute);
    }
  }

  return (
    <div className="home-page page">
      <h1>Обследованные участки</h1>

      <div className="home-page__container">
        <div className="home-page__table-container">
          <div className="home-page__table-filter">
            <p>Сортировать по</p>
            <Select
              options={selectList}
              isSearchable={false}
              className="dropdown"
              classNamePrefix="dropdown"
              value={selectedFilter}
              onChange={(el) => setSelectedFilter(el)}
            />
          </div>

          <div className="home-page__table">
            <div className="home-page__table-block">
              <div className="home-page__table-header">
                <div className="home-page__table-row">
                  <div>Дата</div>
                  <div>Маршрут</div>
                  <div>Статус задачи</div>
                </div>
              </div>
              <div className="home-page__table-body">
                {routes.length > 0 && routes.map((el) => (
                  <div
                    className={`home-page__table-row${selectedRoute.id === el.id ? ' active' : ''}`}
                    key={el.id}
                    onClick={() => changeSelectedRoute(el)}
                  >
                    <div>{el.created_at}</div>
                    <div>{el.name}</div>
                    <div>{el.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="home-page__map-container">
          <div className="home-page__map-row">
            <div>{selectedRoute?.created_at}</div>
            <div>{selectedRoute?.name}</div>
            <div>{selectedRoute?.status}</div>
          </div>
          <div className="home-page__map-item">
            <img src={mapImg} alt="Map"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export {HomePage}
