import React, { Component } from 'react'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

import api from './api'

class ReqAvailAndCopyPasteDate extends Component {
  constructor () {
    super()
    this.state = {
      thisWeek: moment(new Date()).startOf('week').format('YYYY-MM-DD'),
      nextWeek: moment(this.thisWeek).add(6, 'days').startOf('week').format('YYYY-MM-DD'),
      copyWeekStart: undefined,
      shifts: [],
      loaded: false
    }
  }
  componentDidMount () {
    this.getShifts()
  }
  getShifts () {
    const { id } = this.props
    const { thisWeek, nextWeek } = this.state
    api.getWeekShiftInfo(id, thisWeek, nextWeek)
      .then(res => {
        this.setState({ shifts: res,
          loaded: true })
      })
  }
  copyWeekStart (date) {
    let copyWeekStart = moment(date).format('YYYY-MM-DD')
    this.setState({ copyWeekStart: copyWeekStart })
  }
  pasteWeek (e) {
    const { id } = this.props
    let { copyWeekStart, thisWeek } = this.state
    let startWeek = moment(thisWeek).format('YYYY-MM-DD')
    let endWeek = moment(startWeek).add(6, 'days').format('YYYY-MM-DD')
    api.copyPasteWeek(id, startWeek, endWeek, copyWeekStart)
      .then(window.alert(`You successfully copied this week to ${copyWeekStart}`))
  }
  requestAvailability (e) {
    e.preventDefault()
    let { id } = this.props
    let { thisWeek, nextWeek } = this.state
    api.requestAvailability(id, thisWeek, nextWeek)
      .then(res => res)
  }
  assignShifts () {
    let { id } = this.props
    let { shifts } = this.state
    let shiftID = shifts.availability_process.id
    api.assignShifts(id, shiftID)
      .then(res => res)
  }
  render () {
    let { loaded, shifts } = this.state
    if (loaded) {
      if ((shifts.roles.indexOf('owner') > -1) || (shifts.roles.indexOf('manager') > -1)) {
        if (shifts.availability_processes.length === 0) {
          return (<div>
            <div className='requestOffAndCopy'>
              <button className='navButtons' onClick={e => this.requestAvailability(e)}>Request Availability</button>
              <span className='datePicker'>
                <button className='navButtons' onClick={e => this.pasteWeek(e)}>Copy to:</button>
                <DayPickerInput className='date' onDayChange={(day) => this.copyWeekStart(day)} />
              </span>
            </div>
          </div>)
        } else {
          return (
            <div>
              <div className='requestOffAndCopy'>
                <button className='navButtons' onClick={e => this.assignShfts(e)}>Assign Shifts</button>
                <span className='datePicker'>
                  <button className='navButtons' onClick={e => this.pasteWeek(e)}>Copy to:</button>
                  <DayPickerInput className='date' onDayChange={(day) => this.copyWeekStart(day)} />
                </span>
              </div>
            </div>)
        }
      } else {
        return (<div />)
      }
    } else {
      return (<div>Loading</div>)
    }
  }
}
export default ReqAvailAndCopyPasteDate