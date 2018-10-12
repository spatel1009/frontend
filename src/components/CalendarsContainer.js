import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import api from './api'
import CalendarList from './CalendarList'
import Header from './Header'

class CalendarsContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      calendars: {}
    }
  }
  componentDidMount () {
    this.getCalendars()
  }
  getCalendars () {
    api.getCalendars()
      .then(calendars => {
        this.setState({ calendars: calendars })
      })
  }

  render () {
    const { calendars } = this.state
    const { currentUser } = this.props
    let calendarTypes = Object.keys(calendars)
    if (calendarTypes.length > 0) {
      const calendarNames = {
        managed_calendars: 'Managed Calendars',
        owned_calendars: 'Owned Calendars',
        employed_calendars: 'Employed Calendars'
      }
      return (
        <div key={'calendarType'}>
          <div className='listItems'>
            <Link className='title' to='/CreateCalendar'><button className='titleButton'>New Calendar</button></Link>
          </div>
          { calendarTypes.map((calendarType) => {
            let calendarGroup = calendars[calendarType]
            if (calendarGroup.length > 0) {
              return (
                <div>
                  <div key={calendarGroup.id} >
                    <h1 className='titles'>{calendarNames[calendarType]}</h1>
                    <CalendarList key={calendarGroup.id} type={calendarNames[calendarType]} calendarGroup={calendarGroup} />
                  </div>
                  <div className='center'><Link to={`Calendar/UpdateProfile`}><button className='navButtons'>Update Your Profile</button></Link></div>
                </div>
              )
            } else {
              return ('')
            }
          }) }
        </div>
      )
    } else {
      return (<div className='listItems'>
        <Link className='title' to='/CreateCalendar'><button className='titleButton'>New Calendar</button></Link></div>)
    }
  }
}

export default CalendarsContainer
