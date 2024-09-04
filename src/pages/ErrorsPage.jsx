const ErrorsPage = () => {
  return (
    <div className="errors-page page">
      <h1>Отчеты об ошибках</h1>

      <div className="errors-page__table">
        <div className="errors-page__table-header">
          <div className="errors-page__table-row">
            <div>Дата и время</div>
            <div>Ошибка</div>
          </div>
        </div>
        <div className="errors-page__table-body">
          <div className="errors-page__table-row">
            <div>11:00:54&nbsp;&nbsp;&nbsp;05.07.2024 </div>
            <div>Потеря связи с устройством</div>
          </div>
          <div className="errors-page__table-row">
            <div>11:00:54&nbsp;&nbsp;&nbsp;05.07.2024 </div>
            <div>Потеря связи с устройством</div>
          </div>
          <div className="errors-page__table-row">
            <div>11:00:54&nbsp;&nbsp;&nbsp;05.07.2024 </div>
            <div>Потеря связи с устройством</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ErrorsPage };
