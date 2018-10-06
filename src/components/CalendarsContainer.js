import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import api from './api'
import CalendarList from './CalendarList'

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
    console.log('here')
    api.getCalendars()
      .then(calendars => {
        this.setState({ calendars: calendars })
      })
  }

  render () {
    const { calendars } = this.state
    console.log(calendars, 'calendars in calendar container')
    if (calendars) {
      const { managed_calendars, owned_calendars, employed_calendars } = calendars
      return (<div><Link to='/CreateCalendar'>Add Calendar</Link>
        <h2>Managed Calendars</h2>
        {managed_calendars && managed_calendars.map((calendar) => <CalendarList editCalendar={this.editCalendar} key={calendar.id} id={calendar.id} name={calendar.name} />)}
        <h2>Owned Calendars</h2>
        {owned_calendars && owned_calendars.map((calendar) => <CalendarList editCalendar={this.editCalendar} key={calendar.id} id={calendar.id} name={calendar.name} />)}
        <h2>Employed Calendars</h2>
        {employed_calendars && employed_calendars.map((calendar) => <CalendarList editCalendar={this.editCalendar} key={calendar.id} id={calendar.id} name={calendar.name} />)}
      </div>)
    } else {
      return ('')
    }
  }
}

export default CalendarsContainer
