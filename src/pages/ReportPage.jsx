import { useState } from "react";
import mapImg from "../common/images/map5.png"

const ReportPage = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  return (
    <div className="report-page page">
      <div className="report-page__header">
        <h1>Данные по выбранному отчету</h1>
        <button className="button light-button">Выгрузить отчет</button>
        <button className="button light-button">Новый отчет</button>
      </div>

      <div className="report-page__filter">
        <div>
          <label htmlFor="date">Дата</label>
          <input id="date" type="text"/>
        </div>
        <div>
          <label htmlFor="time">Время</label>
          <input id="time" type="text"/>
        </div>
        <div>
          <label htmlFor="route">Маршрут</label>
          <input id="route" type="text"/>
        </div>
        <div>
          <label htmlFor="objects">Обнаружено объектов</label>
          <input id="objects" type="text"/>
        </div>
        <div>
          <label htmlFor="status">Статус задачи</label>
          <input id="status" type="text"/>
        </div>
      </div>

      <h5>Карта маршрута</h5>
      <div className="report-page__map">
        <div className="report-page__map-item">
          <img src={mapImg} alt="Map"/>
        </div>
        <div className="report-page__map-inputs">
          <h5>Область исследования</h5>
          <div className="input-with-label">
            <label htmlFor="">Координаты точки #1</label>
            <input id="" type="text"/>
          </div>
        </div>
      </div>

      <div className="report-page__report">
        <h5>Отчет по обнаруженным объектам</h5>
        <div className="report-page__report-table">
          <div className="report-page__report-table-header">
            <div className="report-page__report-table-row">
              <div>Объект</div>
              <div>Глубина (м)</div>
              <div>Диаметр (м)</div>
              <div>Высота (м)</div>
              <div>Тип</div>
              <div>Координаты</div>
              <div>Указать на карте</div>
            </div>
          </div>
          <div className="report-page__report-table-body">
            <div className="report-page__report-table-row">
              <div>Объект 1</div>
              <div>0.1</div>
              <div>0.2</div>
              <div>0.12</div>
              <div>Тип 1</div>
              <div>123.123.456.78</div>
              <div>Указать на карте</div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-page__preview">
        <h5>Данные по маршруту с металлодетектора</h5>
      </div>
    </div>
  )
}

export {ReportPage}
