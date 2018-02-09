import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';
import Timestamp from 'react-timestamp';
import Moment from 'react-moment';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            events: []
        }
    }


    componentWillMount() {
        localStorage.getItem('events') && this.setState({
            events: JSON.parse(localStorage.getItem('events')),
            isLoading: false
        })
    }


    componentDidMount(){

        const date = localStorage.getItem('eventsDate');
        const eventsDate = date && new Date(parseInt(date));
        const now = new Date();

        const dataAge = Math.round((now - eventsDate) / (1000 * 60)); // in minutes
        const tooOld = dataAge >= 1;

        if(tooOld){
            this.fetchData();
        } else {
            console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
        }

    }

    fetchData(){

        this.setState({
            isLoading: true,
            events: []
        })

        fetch('http://api.ticketweb.com/api/events?method=json&orgId=217273')
        .then(response => response.json())
        .then(parsedJSON => parsedJSON.events.map(event => (
            {
                eventid: `${event.eventid}`,
                eventname: `${event.eventname}`,
                eventurl: `${event.eventurl}`,
                dayofshow: `${event.dates.startdate}`,
                showdoors: `${event.dates.doorsdate}`,
                price: `${event.prices.pricedisplay}`,
                panelimage: `${event.eventimages.original}`,
                backgroundImage: `url(${event.eventimages.original})`,
                description: `${event.description}`,
                prefix: `${event.prefixtext}`,
                // headliner: `${event.attractionList[0].artist}`,
                // open1: `${event.attractionList[1].artist}`,
                attractionList: `${event.attractionList[0].artist}`
            }
        )))
        .then(events => this.setState({
            events,
            isLoading: false
        }))
        .catch(error => console.log('parsing failed', error))

    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('events', JSON.stringify(nextState.events));
        localStorage.setItem('eventsDate', Date.now());
    }


    render() {
        const {isLoading, events} = this.state;
        return (
            <div>
                <header>
                    <img src="https://www.thevanburenphx.com/wp-content/uploads/2017/05/TVB_Phoenix_White-1-e1493673504891.png" />
                    <h1>Upcoming Shows <button className="btn btn-sm btn-danger" onClick={(e) => {
                        this.fetchData();
                    }}>Update List</button>
                    </h1>
                </header>
                <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                    <div className="panel-group">
                        {
                            !isLoading && events.length > 0 ? events.map(event => {
                                const {eventid, eventname, eventurl, dayofshow, price, panelimage, description, showdoors, prefix, headliner, attractionList } = event;

                                let sixdigitdate = dayofshow.substring(0,8);

                                // date
                                let date = dayofshow.substring(6,8);

                                // month
                                let monthnumber = dayofshow.substring(4,6);
                                let getmonth;
                                if (monthnumber = '02') {
                                  getmonth = <span className="month">Feb</span>
                                } else if (monthnumber = '03') {
                                  getmonth = <span className="month">Mar</span>
                                } else {
                                  getmonth = <span>Not in time</span>
                                };

                                // year
                                const year = dayofshow.split('', 4).join('');

                                // formatted date
                                let formatdate = year + ', ' + monthnumber + ', ' + date;
                                let newdate = format(
                                  new Date(formatdate),
                                  'dddd | MMM D, YYYY'
                                );

                                // showtime
                                let timeofshowraw =  dayofshow.substring(8, 14);
                                let gethour = timeofshowraw.substring(0,2);
                                let getmin = timeofshowraw.substring(2,4);
                                let ampm;
                                if (gethour > 12) {
                                  ampm = 'PM';
                                } else {
                                  ampm = 'AM';
                                }
                                let hour;
                                if (gethour === '13') {
                                  hour = 1;
                                } else if (gethour === '14') {
                                  hour = 2;
                                } else if (gethour === '15') {
                                  hour = 3;
                                } else if (gethour === '16') {
                                  hour = 4;
                                } else if (gethour === '17') {
                                  hour = 5;
                                } else if (gethour === '18') {
                                  hour = 6;
                                } else if (gethour === '19') {
                                  hour = 7;
                                } else if (gethour === '20') {
                                  hour = 8;
                                } else if (gethour === '21') {
                                  hour = 9;
                                } else if (gethour === '22') {
                                  hour = 10;
                                } else {
                                  hour = 'new time';
                                }
                                let formattedTime = hour + ':' + getmin + ' ' + ampm;

                                // SET Door Time
                                let doortimeraw = showdoors.substring(8, 14);
                                let getdoorhour = doortimeraw.substring(0,2);
                                let getdoormin = doortimeraw.substring(2,4);
                                let doorhour;
                                if (getdoorhour === '13') {
                                  doorhour = 1;
                                } else if (getdoorhour === '14') {
                                  doorhour = 2;
                                } else if (getdoorhour === '15') {
                                  doorhour = 3;
                                } else if (getdoorhour === '16') {
                                  doorhour = 4;
                                } else if (getdoorhour === '17') {
                                  doorhour = 5;
                                } else if (getdoorhour === '18') {
                                  doorhour = 6;
                                } else if (getdoorhour === '19') {
                                  doorhour = 7;
                                } else if (getdoorhour === '20') {
                                  doorhour = 8;
                                } else if (getdoorhour === '21') {
                                  doorhour = 9;
                                } else if (getdoorhour === '22') {
                                  doorhour = 10;
                                } else {
                                  doorhour = 'new time';
                                }
                                let formattedDoor = doorhour + ":" + getdoormin + ' ' + ampm;

                              // parse description
                                let descriptiontext = description;
                                let parser = new DOMParser;
                                var dom = parser.parseFromString(
                                  '<!doctype html><body>' + descriptiontext, 'text/html');
                                var decodedDescription = dom.body.textContent;




                                return <Collapsible key={eventid} title={eventname} backgroundurl={panelimage} date={dayofshow}>
                                    <p><a target="_blank" className="tix-button" href={eventurl}>Buy Tickets</a><br /></p>
                                    <p className="event-content__presents">{prefix}</p>
                                    <p className="event-content__name">{eventname}</p>
                                    <span className="event-content__date">{newdate} </span>
                                    <p className="event-content__price">Tickets: {price}</p>
                                    <p className="event-content__times">Doors: {formattedDoor}</p>
                                    <p className="event-content__times">Show: {formattedTime}</p>
                                    {decodedDescription}
                                    <div className="artist-list">
                                      <div className="attractions">

                                      </div>
                                    </div>
                                </Collapsible>
                            }) : null
                        }
                    </div>
                    <div className="loader">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default App;
