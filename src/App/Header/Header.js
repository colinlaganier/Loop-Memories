import React  from 'react';
import { NavLink } from 'react-router-dom';

import bubbles from 'assets/imgs/bubbles.svg'
import './Header.css';

export default function ({ hide, lightTheme, setLightTheme, location }) {
  const host = window.location.host;
  const hostSections = host.split(".").slice(-2);

  const lightThemeStyle = lightTheme ? {
    "--header-background-color": "white",
    "--header-text-color": "black",
  } : {}

  return (
    <div className={hide ? "loop-header loop-header-hide" : "loop-header"} style={lightThemeStyle} >
      <NavLink to={location.pathname === "/" ? "/events" : "/"} className="loop-header-hostname">
        {hostSections.map((item, i, arr) => {
          let divider = i < arr.length - 1 && <span className="loop-header-dot">.</span>;
          return (
            <React.Fragment key={i}>
              <span className="loop-header-hostsection">{item}</span>
              {divider}
            </React.Fragment>
          )
        })}
      </NavLink>
      <div className="loop-header-buttons">
        <NavLink to="/" exact>groups</NavLink>
        <NavLink to="/events" exact>events</NavLink>
      </div>
      <label className="switch">
        <input type="checkbox" checked={lightTheme} onChange={e => setLightTheme(e.target.checked)} />
        <span className="slider round"></span>
      </label>
      <div className="loop-header-bubbles" style={{ backgroundImage: `url(${bubbles})` }}></div>
    </div>
  );
}
