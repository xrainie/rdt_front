const DetectionSettingPage = () => {
  return (
    <div className="detection-setting-page page">
      <h1>Настройка обнаружения объектов</h1>

      <div className="switcher">
        <label className='switcher-block'>
          {/*<input type="checkbox" checked={list[switcherName]} onChange={() => handleToggleSwitcher()}/>*/}
          <input type="checkbox" checked/>
          <span className="slider"/>
        </label>
        <p>Использовать авторскую настройку</p>
      </div>

      <div className="detection-setting-page__input">
        <label htmlFor="depth">Глубина сканирования, м</label>
        <input id="depth" type="text"/>
      </div>
    </div>
  )
}

export {DetectionSettingPage};
