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
                description: `${event.description}`
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
                    <img src={image} />
                    <h1>Ticketweb Shows <button className="btn btn-sm btn-danger" onClick={(e) => {
                        this.fetchData();
                    }}>Update List</button>
                    </h1>
                </header>
                <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                    <div className="panel-group">
                        {
                            !isLoading && events.length > 0 ? events.map(event => {
                                const {eventid, eventname, eventurl, dayofshow, price, panelimage, description } = event;

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

                              // parse description
                                let descriptiontext = description;
                                let parser = new DOMParser;
                                var dom = parser.parseFromString(
                                  '<!doctype html><body>' + descriptiontext, 'text/html');
                                var decodedDescription = dom.body.textContent;                            

                                // console.log(formatdescription);
                                return <Collapsible key={eventid} title={eventname} backgroundurl={panelimage} date={dayofshow}>
                                    <p><a target="_blank" className="tix-button" href={eventurl}>Buy Tickets</a><br /></p>
                                    <span>{newdate} </span>
                                    <p>{price}</p>
                                    {decodedDescription}
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
