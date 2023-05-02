import React from 'react'
import Map from './Components/Map/Map';
const App = () => {
  
  return (
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
                <input type="password" placeholder={"Password"} />
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
        <Map />
      </div>
    </div>
  )
}
export default App
