import { useState, useEffect } from "react";

import {addQuadcopters, deleteQuadcopters, getQuadcopters, updateQuadcopters} from "../api";
import Modal from "react-modal";
import Select from "react-select";

const channelCountList = [
  {value: 1, label: 1},
  {value: 2, label: 2},
  {value: 3, label: 3},
  {value: 4, label: 4},
]

const QuadcopterPage = () => {
  const [quadcopters, setQuadcopters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChanelCount, setSelectedChanelCount] = useState(channelCountList[0]);

  const getQuadcoptersList = () => {
    getQuadcopters({search_name: searchValue}).then((response) => {
      setQuadcopters(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getQuadcoptersList();
  }, []);

  const handleSearch = () => {
    getQuadcoptersList();
  }

  const handleKeyDown = (e) => {
    if (e.type === "keydown" && e.keyCode === 13) {
      handleSearch();
    }
  }

  useEffect(() => {
    Modal.setAppElement('body');
  }, [])

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleCreate = (event) => {
    event.preventDefault();

    let name = '';
    let channels = [];
    const form = Array.from(event.target);
    form.map((el) => {
      if (el.name.includes('channel')) {
        channels.push(el.value);
      } else if (el.name.includes('name')) {
        name = el.value;
      }
    })

    addQuadcopters({name, channels,}).then((response) => {
      setIsModalOpen(false);
      getQuadcoptersList();
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleDelete = (id) => {
    deleteQuadcopters(id).then((response) => {
      getQuadcoptersList();
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleChangeNameValue = (e, el) => {
    const newArray = quadcopters;
    const index = quadcopters.findIndex((copter) => el.id === copter.id);

    newArray[index].name = e.target.value;
    setQuadcopters([...newArray]);
  }

  const handleChangeChannelValue = (e, copter, channel) => {
    const newArray = quadcopters;
    const indexCopter = quadcopters.findIndex((copterEl) => copterEl.id === copter.id);
    const indexChannel = quadcopters[indexCopter].channels.findIndex((channelEl) => channelEl.id === channel.id);

    newArray[indexCopter].channels[indexChannel].link = e.target.value;
    setQuadcopters([...newArray]);
  }

  const handleUpdate = (id) => {
    const copter = quadcopters.filter((el) => el.id === id)[0];
    const channels = copter.channels.map((el) => {
      return {link: el.link};
    });

    updateQuadcopters(id, {name: copter.name, channels}).then((response) => {
      getQuadcoptersList();
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
      <div className="quadcopter-page page">
        <h1>Оборудования и устройства</h1>

        <div className="quadcopter-page__filter">
          <div className="input-with-label">
            <label htmlFor="search">Поиск</label>
            <input
              id="search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
          </div>
          <button className="button light-button" onClick={() => handleSearch()}>Поиск</button>
          <button className="button light-button" onClick={() => setIsModalOpen(true)}>
            Добавить устройство
          </button>
        </div>

        <div className="quadcopter-page__list">
          {quadcopters.map((el) => (
            <div className="quadcopter-page__item" key={el.id}>
              <div className="quadcopter-page__item-header">
                <input
                  id={`name-${el.id}}`}
                  type="text"
                  value={el.name}
                  onChange={(e) => handleChangeNameValue(e,el)}
                />
                <button className="button" onClick={() => handleUpdate(el.id)}>ред.</button>
                <button className="button" onClick={() => handleDelete(el.id)}>удалить</button>
              </div>
              <div className="quadcopter-page__item-body">
                {el.channels.map((channel, index) => (
                  <div className="input-with-label" key={channel.id}>
                    <label htmlFor={`channel-${el.id}-${index + 1}`}>Канал связи #{index + 1}</label>
                    <input
                      id={`channel-${el.id}-${index + 1}`}
                      type="text"
                      value={channel.link}
                      onChange={(e) => handleChangeChannelValue(e,el,channel)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal className="quadcopter-page__modal" isOpen={isModalOpen} onRequestClose={closeModal}>
        <form onSubmit={handleCreate}>
          <div className="quadcopter-page__modal-inputs">
            <div className="quadcopter-page__modal-input">
              <p>Введите название устройства</p>
              <input name="name" type="text" />
            </div>
            <div className="quadcopter-page__modal-input">
              <p>Количество каналов связи</p>
              <div className="input-with-label">
                <label htmlFor="count">Каналы связи</label>
                <Select
                  id="count"
                  options={channelCountList}
                  isSearchable={false}
                  className="dropdown"
                  classNamePrefix="dropdown"
                  value={selectedChanelCount}
                  onChange={(el) => setSelectedChanelCount(el)}
                />
              </div>
            </div>

            {Array(selectedChanelCount.label).fill().map((el, index) => (
              <div className="quadcopter-page__modal-input" key={index + 1}>
                <div className="input-with-label">
                  <label htmlFor={`channel-${index + 1}`}>Канал связи #{index + 1}</label>
                  <input id={`channel-${index + 1}`} type="text" name={`channel-${index + 1}`}/>
                </div>
              </div>
            ))}
          </div>

          <button className="quadcopter-page__modal-button outline-button" type="submit">
            Добавить
          </button>
        </form>
      </Modal>
    </>
  )
}

export {QuadcopterPage}
