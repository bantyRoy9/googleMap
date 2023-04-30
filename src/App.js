import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader,Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect } from 'react';
import { countries,states,cities } from './json';
const containerStyle = {
  width: '90vw',
  height: '90vh',
  position:'absolute',
  top:'50%',
  left:'50%',
  transform: 'translate(-50%,-50%)'
};

// const center = {
//   lat: 28.5516782, 
//   lng: 77.0679478
// };

let prevCity =[]
const App = () => {
  const mapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0",
    language:"en",
      region:"EN",
      version:"weekly"
  })

  const [map, setMap] = useState(null);
  const [info,setInfo] = useState(false);
  const [prevCity,setPrevCity] = useState([])
  const [marker,setMarker]=useState({
    markerFor:'country',
    data:countries,
    center:{lat:20,lng:77},
    zoom:4
  })
 // const [position, setPosition] = useState({lat: 28.578614351842646, lng: 77.19344598889874})

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(marker.center);
    mapRef.current = map;
    map.fitBounds(bounds);
    // map.setZoom(5);
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

  const arrangeMarkerData =(markerData,markerTo,name)=>{
    let data =[];
    markerData.forEach(el=>{
      if(markerTo !== 'city'){
        if(el.name.toUpperCase() == name.toUpperCase()){
          data.push(el)
        }
      }else{
        if(el.state.toUpperCase() == name.toUpperCase()){
          data.push(el)
        }
      }
    })
    data.forEach(el=>{
      if(el.name.toUpperCase() == 'INDIA'){
        states.forEach(state=>{
          data.push(state)
        })
      }
    })
    return data
  }
  const markerClickHandler =(markerFor,name)=>{
    let markerData =[],markerTo='',zoom=5,prevCity =[];
    if(markerFor == 'country'){
      markerData = countries
      markerTo = 'state'
      zoom=7
    }else if(markerFor == 'state'){
      markerData = cities
      markerTo = 'city'
      zoom=10
    }else{
      markerData = cities
      markerTo='town'
      zoom=11
    }
    let data = arrangeMarkerData(markerData,markerTo,name)
    setPrevCity(data)
    setMarker({markerFor:markerTo,data:data,center:{lat:parseFloat(data[0].lat),lng:parseFloat(data[0].lng)},zoom:zoom})
  }
  const showTitle=()=>{
    setInfo(true)
  }
  const hideTitle=()=>{
    setInfo(false)
  }
  const changeHandler =(e)=>{
    e.preventDefault();
    let markerData =[],markerTo='',zoom=0;
    if(e.target.name =='back'){
      if(marker.markerFor == 'town'){
        markerData = prevCity
        markerTo = 'city'
        zoom = 5
      }else if(marker.markerFor == 'city'){
        markerData = states
        markerTo = 'state'
        zoom = 5
      }else if(marker.markerFor == 'state'){
        markerData =countries
        markerTo = 'country'
        zoom = 4
      }
    }
    setMarker({markerFor:markerTo,data:markerData,center:{lat:parseFloat(markerData[0].lat),lng:parseFloat(markerData[0].lng)},zoom:zoom})
  }

  return isLoaded ? (
    <>
      <div className="mapCenter">
        <div className="buttons" style={{position:'absolute',left:'10%',top:'10%',zIndex:1}}>
          <input type="button" name='back' onClick={changeHandler}/>
        </div>
      <GoogleMap 
        id='map'
        defaultZoom={marker.zoom}
        de={marker.zoom}
        mapContainerStyle={containerStyle} 
        onLoad={onLoad} 
        onUnmount={onUnmount} 
        onDragEnd={handleCenter}
        center={marker.center} 
        >
          {marker.data.map(el=>(
            <Marker 
              position={{lat: parseFloat(el.lat),lng:parseFloat(el.lng)}} 
              onMouseOver={()=>showTitle(el.name)}
              onMouseOut={()=>hideTitle()}
              onClick={()=>markerClickHandler(marker.markerFor,el.name)}
              // onLoad={onLoad}
              >
                  {/* {!info && 
                    <InfoWindow>
                        <p>{el.name}</p>
                    </InfoWindow>
                  }  */}
                {/* <InfoWindow
                     pixelOffset={"0"}
                     marker={"HELLO"}
                     visible={true}>
                       <div>
                            <h1>{"HELLO"}</h1>
                       </div>
                </InfoWindow> */}
              </Marker>
          ))}
        <></>
      </GoogleMap>
      </div>
      </>
  ) : <></>
}
export default App
