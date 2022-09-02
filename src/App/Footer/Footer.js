import React from 'react';

import './Footer.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'

library.add(faApple, faGooglePlay)

const logo = '/icons/logo.svg';

function Footer({ lightTheme }) {
    return (
        <div id="footer" className="loop-footer" style={{
            backgroundColor: lightTheme ? "#d6f9ff" : "black",
            '--text-color': lightTheme ? "black" : "var(--nearlyfff)",
        }}>
            <div className="loop-footer-content">
                <div className="loop-footer-top">
                    <img className="loop-footer-logo" src={logo} alt="Loop" />
                    <p className="loop-footer-download-loop">Download <span className="loop-footer-loop" style={{
                        color: lightTheme ? "black" : "var(--theblue)",
                    }}>Loop</span></p>
                </div>
                <p className="loop-footer-desc">Reminders, directions, photos, all in <span className="loop-footer-nobr">one place</span>.</p><p className="loop-footer-desc">You'll never miss an event again! <span role="img" aria-label="OK emoji">👌</span></p>
                {/* <p className="loop-footer-downloadLoop}>Download Loop</p> */}
                {/* <p className="loop-footer-desc}>For easy access to <strong className="loop-footer-nobr}>meetup directions</strong>, <strong className="loop-footer-nobr}>calender reminders</strong>, and <strong className="loop-footer-nobr}>photos</strong>!</p> */}
                <div className="loop-footer-links">
                    <a className="loop-footer-link" href="https://goo.gl/U4SvUP"><FontAwesomeIcon icon={faApple} className="loop-footer-link-icon" /> iOS</a>
                    <a className="loop-footer-link" href="https://goo.gl/8iQXYy"><FontAwesomeIcon icon={faGooglePlay} className="loop-footer-link-icon" /> Android</a>
                </div>
                {/* <div className="loop-footer-ppfaq-links">
                    <a className="loop-footer-pp-link" href="https://drive.google.com/file/d/1GafOvP1QOZEww_lti3oXA_7l1LjxxZ0t/view">Privacy Policy</a>
                    <span>&amp;</span>
                    <a className="loop-footer-faq-link" href="https://medium.com/officiallyloop/frequently-asked-questions-f80251ce2356">FAQ</a>
                </div> */}
            </div>
        </div>
    )
}

export default Footer;
