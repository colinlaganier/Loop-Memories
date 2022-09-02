import React, { useState, useEffect, useMemo} from 'react';

import cross from 'assets/imgs/cross.svg';

import LazyLoad from 'react-lazy-load';
import { apiFetch } from 'utils/helpers';
import { daytime } from 'assets/colours.js';
import usePageTitle from 'utils/hooks/pageTitle';
import { Footer } from 'App/Footer';


import './Memories.css';

function getWindowDimensions() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export const useWindowDimensions = function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function trimHex(s) { return (s.charAt(0) === '#') ? s.substring(1, 7) : s }

function convertToRGB(hexString) {
  const hex = trimHex(hexString);
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}

const useScrollPosition = function () {
  const [scroll, setScroll] = useState(window.scrollY);

  useEffect(() => {
    let prev = document.body.onscroll

    function handleResize() {
      if (prev) prev();
      setScroll(window.scrollY / (document.body.clientHeight - window.innerHeight ));
    }

    document.body.onscroll = handleResize;
    return () => document.body.onscroll = prev;
  }, []);
  return scroll;
}

const useHeaderPosition = function () {
  const [headPos, setHeadPos] = useState(-300);

  useEffect(() => {
    let prev = document.body.onscroll

    function handleResize() {
      if (prev) prev();
      let header = document.getElementsByClassName("app-header")[0]
      let headerHeight = header ? header.clientHeight : 380;
      setHeadPos(window.scrollY > headerHeight ? 0 : -300);
    }

    document.body.onscroll = handleResize;
    return () => document.body.onscroll = prev;
  }, []);

  return headPos;
}

function HeightPhotosLoading() {
  const { width: windowWidth } = useWindowDimensions();
  return windowWidth > 600
    ? 0.25 * windowWidth + 2
    : 0.38 * windowWidth + 1;
}

function PhotoThumbnail({
  eventId, uid, eventEmoji, photoUploader, eventName, timeCreated, thumbnailTimeStampHour, thumbnailAmpm, dispTimeStamp, uploaderFirstName, uploaderPhoto, photoDispNum, leftcolor, rightColor, totalNumPhotos
}) {
  const [showFullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (showFullscreen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showFullscreen]);

  const linkOriginal = `https://images.loop.party/${eventId}/${uid}/original.png`;
  const linkThumbnail = `https://images.loop.party/${eventId}/${uid}/400.png`;

  const orientation = Orientation(linkThumbnail)

  return(
    <LazyLoad height={HeightPhotosLoading()} offsetVertical={0}>
      <div className="loop-event-photo-container">
        {showFullscreen &&
          <FullscreenDisplay
            linkOriginal={linkOriginal}
            disp="block"
            eventEmoji={eventEmoji}
            eventName={eventName}
            timeCreated={timeCreated}
            uploaderFirstName={uploaderFirstName}
            uploaderPhoto={uploaderPhoto}
            onClose={() => setFullscreen(false)}
            photoDispNum={photoDispNum}
            leftcolor={leftcolor}
            rightColor={rightColor}
            totalNumPhotos={totalNumPhotos}
            linkThumbnail={linkThumbnail}
            orientation={orientation}
          />
        }
        {dispTimeStamp &&
          <TimeStampThumbnail
            thumbnailTimeStampHour={thumbnailTimeStampHour}
            thumbnailAmpm={thumbnailAmpm}
          />
        }
        <a className="loop-event-photo-link" onClick={() => setFullscreen(true)}>
          <img className="loop-event-photo-thumbnail" src={linkThumbnail} alt="" style={{
            ...orientation
          }}/>
        </a>
      </div>
    </LazyLoad>
  )
}

function Orientation(linkThumbnail) {
  const [size, setSize] = useState({width: '100%', height: 'auto'})

  useEffect(() => {
    var imgFile = new Image();
    imgFile.src = linkThumbnail;
    imgFile.onload = () => {
      if (imgFile.height <= imgFile.width) {
        setSize({width: 'auto', height: '100%'})
      }
    }
  }, [linkThumbnail, setSize]);

  return size;
}

function TimeStampThumbnail({thumbnailTimeStampHour, thumbnailAmpm}) {
  return(
    <>
      <div className="loop-event-photo-thumbnail-corner-gradient">
        <p>{(thumbnailTimeStampHour % 12) + ":00" + thumbnailAmpm}</p>
      </div>
    </>
  )
}

function HeightPhoto(imageUrl) {
  const [fullscreenPhotoHeight, setFullscreenPhotoHeight] = useState();
  const [fullscreenPhotoWidth, setFullscreenPhotoWidth] = useState();
  const { width: windowWidth, height: windowHeight} = useWindowDimensions();

  useEffect(() => {
    var imgFile = new Image();
    imgFile.src = imageUrl;
    imgFile.onload = () => {
      if (windowWidth > 600) {
        if (imgFile.height <= imgFile.width){
          if (0.8 * windowWidth * imgFile.height / imgFile.width >= 0.95 * windowHeight) {
            setFullscreenPhotoHeight(0.95 * windowHeight);
          }
          else {
            setFullscreenPhotoHeight(0.8 * windowWidth * imgFile.height / imgFile.width);
          }
        }
        else {
          setFullscreenPhotoHeight(0.95 * windowHeight);
        }
      }
      else {
        setFullscreenPhotoHeight(windowWidth * imgFile.height / imgFile.width);
      }
    }
  }, [windowWidth, setFullscreenPhotoHeight]);

  return fullscreenPhotoHeight
}

function WidthPhoto(imageUrl) {
  const [fullscreenPhotoWidth, setFullscreenPhotoWidth] = useState();
  const { width: windowWidth, height: windowHeight} = useWindowDimensions();

  useEffect(() => {
    var imgFile = new Image();
    imgFile.src = imageUrl;
    imgFile.onload = () => {

      if (0.8 * windowWidth * imgFile.height / imgFile.width >= 0.95 * windowHeight){
        setFullscreenPhotoWidth((0.95 * windowHeight * imgFile.width / imgFile.height) + "px");
      }
      else if (imgFile.height <= imgFile.width){
        setFullscreenPhotoWidth("80%");
      }
      else {
        setFullscreenPhotoWidth((0.95 * windowHeight * imgFile.width / imgFile.height) + "px");
      }
    }
  }, [windowWidth, setFullscreenPhotoWidth]);

  return fullscreenPhotoWidth
}

function FullscreenDisplay({linkOriginal,disp,eventEmoji,eventName,timeCreated,uploaderFirstName,uploaderPhoto,onClose,photoDispNum,leftcolor,rightColor,totalNumPhotos,linkThumbnail}) {
  const { width: windowWidth } = useWindowDimensions();
  const mobile = useMemo(() => windowWidth < 700, [windowWidth]);
  let heightPhoto = Math.round(HeightPhoto(linkThumbnail)) + "px";
  let calcHeight = "calc(" + heightPhoto + " - 53.75px + ((100vh - " + heightPhoto + ")/2))";
  return (
    <>
      <div className="loop-event-gallery-blurry-layer" onClick={onClose} style={{"--display": disp}}></div>
      <a className="loop-dialog-cross-click">
        <img className="loop-dialog-cross" onClick={onClose} src={cross} width="40" height="40" alt="" style={{
          display: disp,
          position: 'fixed',
          width: '40px',
          top: '3.2rem',
          right: '.9rem',
          height: '40px',
          left: 'unset',
        }}/>
      </a>
      <div className="loop-event-photo-gallery-fullscreen-box" style={{"--display": disp}}>
        <div className="loop-event-photo-gallery-fullscreen-content">
          <PhotoWithThumbnail
            linkThumbnail={linkThumbnail}
            linkOriginal={linkOriginal}
          />
          <div className="loop-event-photo-gallery-fullscreen-details" style={{top: calcHeight, width: mobile ? "100%" : WidthPhoto(linkThumbnail)}}>
            <div className="loop-event-photo-gallery-fullscreen-shared-container">
              <img className="loop-event-attended-members-photo" src={uploaderPhoto} alt="" style={{...sizeShareId(uploaderPhoto), position: "relative"}}/>
            </div>
            <div className="loop-event-photo-gallery-fullscreen-text">
              <p className="loop-event-photo-gallery-fullscreen-time">{formatTime(timeCreated)}</p>
              <p className="loop-event-photo-gallery-fullscreen-user-uploaded">Shared by {uploaderFirstName}</p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

function FullAttendingListModal({going, disp, onClose}) {
  const { width: windowWidth } = useWindowDimensions();
  let numPhantom = Math.floor(windowWidth / 160);
  return <>
    <div className="loop-event-gallery-blurry-layer" onClick={onClose} style={{"--display": disp}}></div>
    <a className="loop-dialog-cross-click">
      <img className="loop-dialog-cross" onClick={onClose} src={cross} width="40" height="40" alt="" style={{
        display: disp,
        position: 'fixed',
        width: '40px',
        top: '3.2rem',
        right: '.9rem',
        height: '40px',
        left: 'unset',
      }}/>
    </a>
    <div className="loop-event-full-attended-display">
      <div className="loop-event-full-attended-display-content">
        <p className="loop-event-list-attended-title">Attended</p>
        {going.map(({imageUrl, name}, key) =>
          <FullAttendingList key={key} name={name} imageUrl={imageUrl}/>
        )}
        {Array(numPhantom).fill(null).map((_, key) =>
          <div key={key} className={"loop-event-full-attended-container hidden"}></div>
        )}
      </div>
    </div>
  </>
}

function dimensionsPhotoAttending(imageUrl) {
  var imgFile = new Image();
  imgFile.src = imageUrl;
  if (imgFile.height > imgFile.width) {
    return({width: "5em",  height: "unset", transform: "translate(0px, -25%)" })
  }
  else if (imgFile.height < imgFile.width) {
    return({width: "unset",  height: "5em", transform: "translate(-25%, 0px)"})
  }
  else {
    return({width: "5em",  height: "5em"})
  }
}

function FullAttendingList({imageUrl, name}) {
  return (
    <div className="loop-event-full-attended-container">
      <div className="loop-event-full-attended-photo-container">
        <img className="loop-event-full-attended-members-photo" src={imageUrl} alt="" style={{...dimensionsPhotoAttending(imageUrl)}}/>
      </div>
      <p className="loop-event-attended-name">{name}</p>
    </div>
  );
}

function numberAttendeePreview(mobile) {
  return mobile ? 4 : 5;
}

function OrientationDisplay(linkOriginal) {
  const [size,setSize] = useState({height: 'auto', width: '100%'})
  const { width: windowWidth, height: windowHeight} = useWindowDimensions();

  useEffect(() => {
    var imgFile = new Image();
    imgFile.src = linkOriginal;
    if (window.innerWidth > 600) {
      imgFile.onload = () => {
        if (imgFile.height > imgFile.width) {
          setSize({height: "95%", width: "auto"})
        }
        else if (0.8 * windowWidth * imgFile.height / imgFile.width >= 0.95 * windowHeight) {
          setSize({height: "95%", width: "auto"});
        }
        else {setSize({width: "80%", height: "auto"});
        }
      }
    }
  }, [linkOriginal, setSize]);

  return size;
}

function PhotoWithThumbnail({ linkThumbnail, linkOriginal }) {
  const [src, setSrc] = useState(linkThumbnail);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { setSrc(linkOriginal) };
    img.src = linkOriginal;

    return () => {
      img.onload = undefined;
    }
  }, [linkOriginal, setSrc]);

  return (
    <img className="loop-event-photo-gallery-fullscreen-image" src={src} alt="" style={{
      position: 'fixed',
      ...OrientationDisplay(src),
    }} />
  );
}

function formatTime(time){
  const date = new Date(1000 * time);
  const hours = date.getHours() % 12 || 12;
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const timeSuffix = date.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes} ${timeSuffix}`;
}

function attendingOrientation(imageUrl) {
  var imgFile = new Image();
  imgFile.src = imageUrl;
  if (imgFile.height > imgFile.width) {
    return({width: "2.5em",  height: "unset", transform: "translate(0px, -25%)" })
  }
  else if (imgFile.height < imgFile.width) {
    return({width: "unset",  height: "2.5em", transform: "translate(-25%, 0px)"})
  }
  else {
    return({width: "2.5em",  height: "2.5em"})
  }
}

function sizeShareId(imageUrl) {
  var imgFile = new Image();
  imgFile.src = imageUrl;
  if (imgFile.height > imgFile.width) {
    return({width: "3em",  height: "unset", transform: "translate(0px, -25%)" })
  }
  else if (imgFile.height < imgFile.width) {
    return({width: "unset",  height: "3em", transform: "translate(-25%, 0px)"})
  }
  else {
    return({width: "3em",  height: "3em"})
  }
}

function DispFirstAttending({imageUrl}) {
  return(
    <div className="loop-event-attended-container">
      <img className="loop-event-attended-members-photo" src={imageUrl} alt="" style={{...attendingOrientation(imageUrl)}}/>
   </div>
  )
}


function Memories({ hideHeader, match }) {
  hideHeader(true);

  const [event, setEvent] = useState({loaded: false});
  const [photos,setPhotos] = useState([]);
  const [photoTimed, setPhotoTimed] = useState([]);
  const [trendingPhoto, setTrendingPhoto] = useState();

  const eventId = match.params.dev === "dev_" ? `dev_${match.params.event_id}` : match.params.event_id;

  const setTitle = usePageTitle();

  useEffect(() => {
    if (event.loaded === true && event.name) {
      setTitle(`Memories from ${event.name}`);
    } else {
      setTitle();
    }
  }, [setTitle, event.loaded, event.name]);

  useEffect(() => {
    getEvent(eventId, setEvent);
    getPhotos(eventId, setPhotos, setPhotoTimed, setTrendingPhoto);
  }, [eventId]);

  let eventName = event.name;
  let eventEmoji = event.emoji;
  let eventOrganizer = event.organizerName;
  let eventOrganizerPhoto = event.organizerImageUrl;
  let eventDate = `${event.day} ${event.dateNum} ${event.month}`;
  let eventRoute = `/event/${eventId}`;
  let totalNumPhotos = photos.length;

  const [, , timeSlot, darkTheme] = useMemo(() => {
    const times = [0, 4, 5, 5.75, 7, 11, 15, 19, 20.5, 21, 22, 24]
    const startTime = event.startTime;
    const endTime = event.endTime;

    const averageTime = new Date(1000 * (startTime + endTime) / 2);

    const timeFloat = averageTime.getHours() + averageTime.getMinutes() / 60.0;
    let timeSlot = 0;
    for (var i = 0; i < times.length - 1; i++) {
      timeSlot = i;
      if (timeFloat < times[i + 1]) { break }
    }

    let darkTheme = timeSlot < 2 || timeSlot > 7;

    return [new Date(startTime * 1000), new Date(endTime * 1000), timeSlot, darkTheme];
  }, [event]);

  const colours = [daytime[timeSlot % daytime.length], daytime[(timeSlot + 1) % daytime.length]];

  let color1 = colours[0];
  let color2 = colours[1];

  let scrollPosition = useScrollPosition();
  let headerPosition = useHeaderPosition();

  let leftcolor = convertToRGB(color1);
  let rightColor = convertToRGB(color2);

    // document.body.style.background = "linear-gradient(121deg,"+color1+","+color1+" 5%,"+color2+" 95%,"+color2+")";
  document.body.style.backgroundColor = "white"
  const { width: windowWidth } = useWindowDimensions();
  const mobile = useMemo(() => windowWidth < 700, [windowWidth]);

  const [showFullAttending, setShowFullAttending] = useState(false);

  useEffect(() => {
    if (showFullAttending) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showFullAttending]);


  return (
    <div className="Memories" style={{
      "--left-color":color1,
      "--right-color":color2,
      "--text-color": darkTheme ? "white" : "black",
    }}>
      {event.loaded && <>
        <nav style={{
          zIndex: '2',
          "--left-color-red": leftcolor[0],
          "--left-color-green": leftcolor[1],
          "--left-color-blue": leftcolor[2],
          "--right-color-red": rightColor[0],
          "--right-color-green": rightColor[1],
          "--right-color-blue": rightColor[2],
          "--position": scrollPosition,
          "top": headerPosition,
        }}>
          <div className="fixed-header-content">
            <div className="fixed-header-content-phone-icons" style={{display:mobile ? "block" : "none"}}>
              <img src={eventOrganizerPhoto} className="fixed-organizer-photo" alt="" />
              <span role="img" className="loop-event-fixed-header-emoji">{eventEmoji}</span>
            </div>
            <img src={eventOrganizerPhoto} className="fixed-organizer-photo" alt="" style={{display:mobile ? "none" : "inline-block"}}/>
            <div className="app-fixed-header-detail">
              <p className="loop-fixed-event-title">{eventName}</p>
              <p className="loop-fixed-event-attending">{event.going.length} ATTENDED</p>
            </div>
            <span role="img" className="loop-event-fixed-header-emoji" style={{display:mobile ? "none" : "inline-block"}}>{eventEmoji}</span>
          </div>
        </nav>
        <div className="app-header" style={{
          visibility: headerPosition === 0 ? "hidden" : null,
        }}>
          <div className="loop-event-title-content">
            <div className="loop-event-title-icon">
              <img src={eventOrganizerPhoto} className="organizer-photo" alt="" />
              <span role="img" className="loop-event-title-emoji">{eventEmoji}</span>
            </div>
            <p className="loop-event-title">{eventName}</p>
            <div className="loop-event-title-detail">
              <p className="loop-event-title-host">HOSTED BY <span className="highlight-word">{eventOrganizer}</span>  • {eventDate}</p>
            </div>
            <div className="loop-event-attended-members">
              {event.going.length > numberAttendeePreview(mobile)
                ? <>
                    {event.going.slice(0, numberAttendeePreview(mobile) - 1).map(({imageUrl}, key) => <DispFirstAttending imageUrl={imageUrl} key={key}/>)}
                    <div className="loop-event-attended-container-more" onClick={() => setShowFullAttending(true)}>
                      <p>{event.going.length - numberAttendeePreview(mobile) + 1}+</p>
                    </div>
                  </>
                : <> {event.going.map(({imageUrl}, key) => <DispFirstAttending imageUrl={imageUrl} key={key}/>)} </>
              }
            </div>
            <div className="loop-event-title-link">
              <a role="button" className="loop-event-link-icon" href={eventRoute}>VIEW EVENT PAGE <span className="loop-event-link-emoji">🔍</span></a>
            </div>
          </div>
          <div className="loop-event-title-inside-highlight" style={{backgroundImage: `url(${"https://images.loop.party/" + eventId + "/" + trendingPhoto + "/800.png"})`}}>
          </div>
        </div>
        {showFullAttending &&
          <FullAttendingListModal
            going={event.going}
            disp="block"
            eventEmoji={eventEmoji}
            onClose={() => setShowFullAttending(false)}
          />
        }
        <div className="loop-event-gallery">
          {
            Object.entries(photoTimed).map ( ([time, photos]) => {
              const thumbnailTimeStamp = new Date(1000 * 3600 * time)
              const thumbnailTimeStampHour = thumbnailTimeStamp.getHours()
              const thumbnailAmpm = thumbnailTimeStampHour >= 12 ? "PM" : "AM";
              return photos.map ( ({uid, photoTime, uploaderFirstName,uploaderPhoto, index}, i) =>
                <PhotoThumbnail
                  key={uid}
                  eventId={eventId}
                  uid={uid}
                  eventEmoji={eventEmoji}
                  eventName={eventName}
                  timeCreated={photoTime}
                  uploaderFirstName = {uploaderFirstName}
                  uploaderPhoto={uploaderPhoto}
                  thumbnailTimeStampHour={thumbnailTimeStampHour}
                  thumbnailAmpm={thumbnailAmpm}
                  dispTimeStamp={i === 0}
                  photoDispNum={index}
                  totalNumPhotos={totalNumPhotos}
                  leftcolor={leftcolor}
                  rightColor={rightColor}/>
              );
            }).flat()
          }
          {
            Array(2).fill(null).map((_, key) =>
              <div key={key} className="loop-event-photo-container hidden" style={{height:0}}></div>
            )
          }
        </div>
        <Footer lightTheme={false} />
      </>
      }
    </div>
  )
}

function getEvent(eventId, setEvent) {
  apiFetch("GET", `/events/id/${eventId}`).then(
    ({event, organizer}) => {
      const name = event.title;
      const going = event.going.map(member => {
        return { ...member, name: member.name.split(" ", 1)[0] }
      });
      const organizerImageUrl = organizer.imageUrl;
      const organizerName = organizer.name;
      const numAttending = event.going.length;
      const startTime = event.times[0];
      const startTimeDate = new Date(1000 * event.times[0]);
      const endTime = event.times[1];
      const endTimeDate = new Date(1000 * event.times[1]);
      const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const day = days[startTimeDate.getDay()];
      const dateNum = startTimeDate.getDate();
      const month = months[startTimeDate.getMonth()];
      const emoji = event.activity.emoji;

      setEvent({loaded: true, name, organizerImageUrl, organizerName, numAttending, startTimeDate, endTimeDate, startTime, endTime, day, dateNum, month, emoji, going});
    });
}

function getPhotos(eventId, setPhotos, setPhotoTimed, setTrendingPhoto) {
  apiFetch("GET", `/events/photos/${eventId}`).then(
    ({photos}) => {
      const all_images = photos.sort((l, r) => {
        let ltime = l.dateCreated || l.timeUploaded
        let rtime = r.dateCreated || r.timeUploaded
        return ltime - rtime
      });
      const timed_images = []

      all_images.forEach(({dateCreated, timeUploaded, uid, uploaderFirstName, uploaderId}, index) => {
        const photoTime = dateCreated || timeUploaded;
        const uploaderPhoto = "https://images.loop.party/users/" + uploaderId + "/profile/200.png";
        var t = Math.floor(photoTime / 3600);
        if (!timed_images[t]) { timed_images[t] = [{photoTime, timeUploaded, uid, uploaderFirstName, uploaderPhoto, index}]; }
        else { timed_images[t] = [...timed_images[t], {photoTime, timeUploaded, uid, uploaderFirstName, uploaderPhoto, index}]; }
      });

      if (photos.length > 0) {
        let photoNum = Math.ceil(Math.random() * (photos.length - 1))
        let trend = photos[photoNum].uid
        setTrendingPhoto(trend)
      }

      setPhotoTimed(timed_images)
      setPhotos(photos)
    })
}

export default Memories;
