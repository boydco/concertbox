import React from 'react';
import PropTypes from 'prop-types';

class Collapsible extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isExpanded: false
        }
    }

    handleToggle(e){
        e.preventDefault();
        this.setState({
            isExpanded: !this.state.isExpanded,
            height: this.refs.inner.clientHeight
        })
    }

    render(){
        const {title, backgroundurl, backgroundImage, date, children} = this.props;
        const {isExpanded, height} = this.state;
        const currentHeight = isExpanded ? height : 0;
        let monthnum = date.substring(4,6);
        let month;
        if (monthnum == '01') {
          month = 'Jan';
        } else if (monthnum == '02') {
          month = 'Feb';
        } else if (monthnum == '03') {
          month = 'Mar';
        } else if (monthnum == '04') {
          month = 'April';
        } else {
          month = 'New Month';
        }

        let day = date.substring(6,8);

        return (
            <div className={`panel ${isExpanded ? 'is-expanded' : ''}`} >
                <div style={{backgroundImage: "url(" + backgroundurl + ")"}} className="panel-heading" >
                    <div className="panel-overlay">
                      <div className="panel-overlay__date">
                        <span>{month}</span>
                        <span>{day}</span>
                      </div>
                      <h2>{title}</h2>
                      <div className="panel-overlay__btn" onClick={(e) => this.handleToggle(e)}>
                        More Info
                      </div>
                    </div>
                    <img src={backgroundurl}/>
                </div>
                <div className="panel-collapse" style={{height: currentHeight+'px'}}>
                    <div className="panel-body" ref="inner">
                        {children}
                    </div>
                </div>
            </div>
        )
    }

}

Collapsible.propTypes = {
    title: PropTypes.string,
    backgroundurl: PropTypes.string,
    backgroundImage: PropTypes.string,
    date: PropTypes.string
};

export default Collapsible;
