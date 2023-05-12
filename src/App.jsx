import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect } from 'react';
import { countries, states, cities } from './json';
import Spinner from './Components/Spinner';
import './App.css'
import { NavLink } from 'react-router-dom';
const containerStyle = {
  width: '65vw',
  height: '80vh',
  // padding:'250px'
  // position: 'absolute',
  // top: '50%',
  // left: '50%',
  //transform: 'translate(-50%,-50%)'
};


let selectedMarker = { country: '', state: '', city: '' }
const App = () => {
  const mapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0",
    language: "en",
    region: "EN",
    version: "weekly"
  })

  const [map, setMap] = useState(null);
  const [info, setInfo] = useState(false);
  const [prevCity, setPrevCity] = useState([])
  const [prevDate, setprevDate] = useState({ country: null, state: null, city: null })
  const [selectMarker, setSelectMarker] = useState(null)
  const [markerSelected, setMarkerSelected] = useState(selectedMarker)
  const [marker, setMarker] = useState({ markerFor: 'country', data: countries, center: { lat: 20, lng: 77 }, zoom: 4 })

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(marker.center);
    marker.data.forEach(({lat,lng})=> bounds.extend({lat,lng}))
    mapRef.current = map;
    //map.fitBounds(bounds);
    map.setZoom(4);
    setMap(map)
  }, [])

  function handleCenter() {
    if (!mapRef.current) return;
    const newPos = mapRef.current.getCenter().toJSON();
    //  setPosition(newPos);
  }

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const arrangeMarkerData = (markerData, markerTo, name, iscityFilter) => {
    let dataObj = {}, data = [], prevRec = [];
    markerData.forEach(el => {
      if (markerTo !== 'city') {
        if (el.name.toUpperCase() === name.toUpperCase()) {
          data.push(el)
          if (iscityFilter) {
            prevRec.push(el)
          }
        }
      } else {
        if (el.state.toUpperCase() === name.toUpperCase()) {
          data.push(el)
          prevRec.push(el)
        }
      }
    })
    data.forEach(el => {
      if (el.name.toUpperCase() === 'INDIA') {
        states.forEach(state => {
          data.push(state)
          prevRec.push(el)
        })
      }
    })
    prevDate[markerTo] = prevRec;
    return { data, prevRec }
  }
  const markerClickHandler = (markerFor, dataEle) => {
    let markerData = [], markerTo = '', zoom = 5, prevCity = [], iscityFilter = false;
    let name = dataEle.name;
    if (markerFor === 'country') {
      markerData = countries
      // selectedMarker.country = dataEle.name
      iscityFilter = false
      markerTo = 'state'
      zoom = 5
    } else if (markerFor === 'state') {
      markerData = cities
      // selectedMarker.country = dataEle.name
      markerTo = 'city'
      iscityFilter = true
      zoom = 7
    } else {
      markerData = cities
      markerTo = 'town'
      iscityFilter = false
      zoom = 10
    }
    markerSelected[markerFor] = dataEle.name
    //console.log(markerSelected)
    let data = arrangeMarkerData(markerData, markerTo, name, iscityFilter)
    iscityFilter && setPrevCity(data.prevRec)
    setMarkerSelected(markerSelected)
    setMarker({ markerFor: markerTo, data: data.data, center: { lat: parseFloat(dataEle.lat), lng: parseFloat(dataEle.lng) }, zoom: zoom })
  }
  const showTitle = () => {
    setInfo(true)
  }
  const hideTitle = () => {
    setInfo(false)
  }
  const changeHandler = (name) => {
    let markerData = [], markerTo = '', zoom = 0;
    console.log(name);
    if (!name) {
      // marker.markerFor=name
      if (marker.markerFor === 'town') {
        markerData = prevCity
        markerTo = 'city'
        zoom = 5
      } else if (marker.markerFor === 'city') {
        markerData = states
        markerTo = 'state'
        zoom = 5
      } else if (marker.markerFor === 'state') {
        markerData = countries
        markerTo = 'country'
        zoom = 4
      }
    } else {
      if (name === 'state') {
        markerSelected.city = ''
        zoom = 5
        markerData = prevDate.city
      } else if (name === 'country') {
        markerData = prevDate.state
        zoom = 4
        markerSelected.city = markerSelected.state = ''
      } else if (name === 'countries') {
        markerData = countries
        markerTo = 'country'
        zoom = 5
        prevDate.city = prevDate.country = prevDate.state = null
        markerSelected.city = markerSelected.state = markerSelected.country = ''
      }
    }
    setMarkerSelected(markerSelected)
    setprevDate(prevDate)
    if (markerData && markerData.length) {
      setMarker({ markerFor: markerTo, data: markerData, center: { lat: parseFloat(markerData[0].lat), lng: parseFloat(markerData[0].lng) }, zoom: zoom })
    }
  }

  return isLoaded ? <>
    <div className="container">
      <div className="userContainer">
        <div className="section">
          <div className="sectionNav">

          </div>
          <div className="sectionIcon">
            <div className="img">
              <img className='userImg' src="/img/user.png" alt="User" />
            </div>
          </div>
          <div className="sectionInput">
            <form action="">
              <div className="userName">
                <label htmlFor="UserName">User</label>
                <input type="text" name='user' placeholder='UserId' />
              </div>
              <div className="userPass">
                <label htmlFor="password">Password</label>
                <input type="password" placeholder='********' />
              </div>
              <div className="userBtn">
                <div className="btnSection">
                  <input type="submit" value={'Login'} />
                </div>
                <div className="btnSign">
                  <div>
                    <span>Register Here</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mapContainer">

        <div className="mapCenter">
          <div className="buttons">
            <i className="fa-solid fa-arrow-left" onClick={() => changeHandler()}></i>
            <div className='breadcrum'><span onClick={() => changeHandler('countries')}>All Country</span>
              {markerSelected?.country && <><span> / </span> <span onClick={() => changeHandler('country')}>{markerSelected?.country}</span></>}
              {markerSelected?.state && <><span> / </span><span onClick={() => changeHandler('state')}>{markerSelected?.state}</span></>}
              {markerSelected?.city && <><span> / </span><span onClick={() => changeHandler('city')}>{markerSelected?.city}</span></>}
              {markerSelected?.town && <><span> / </span><span onClick={() => changeHandler('town')}>{markerSelected?.town}</span></>}
            </div>
          </div>
          <GoogleMap
            id='map'
            zoom={marker.zoom}
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onDragEnd={handleCenter}
            center={marker.center}
            onClick={(e) => alert({ e })}
          >
            {marker.data.map((el,idx) => (
              <Marker
                key={idx}
                position={{ lat: parseFloat(el.lat), lng: parseFloat(el.lng) }}
                onMouseOver={() => showTitle(el.name)}
                onMouseOut={() => hideTitle()}
                onDblClick={() => markerClickHandler(marker.markerFor, el)}
                onClick={() => setSelectMarker(idx)}
              // onLoad={onLoad}
              >
                {selectMarker === idx &&
                    <InfoWindow onCloseClick={() => setSelectMarker(null)}>
                      <p>{el.name}</p>
                    </InfoWindow>
                }
              </Marker>

            ))}

          </GoogleMap>
        </div>
      </div>
    </div>

  </>
    : <></>
}
export default App
