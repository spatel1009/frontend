import React, { Component } from 'react'
import moment from 'moment'
import { Delete, Button } from 'bloomer'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

import { Link } from 'react-router-dom'

import api from './api'

class WeekView extends Component {
  constructor () {
    super()
    this.state = {
      shifts: [],
      thisWeek: moment(new Date()).startOf('week').format('YYYY-MM-DD'),
      nextWeek: moment(this.thisWeek).add(6, 'days').startOf('week').format('YYYY-MM-DD'),
      lastWeek: moment(this.thisWeek).subtract(7, 'days').startOf('week').format('YYYY-MM-DD'),
      copyWeekStart: undefined,
      notesExist: false,
      shiftSwapsIndex: [],
      loaded: false

    }
  }
  approvetShiftSwap (e, value) {
    let { token } = this.props
    e.preventDefault()
    api.approveRequest(value, token)
  }
  componentDidMount () {
    this.getShifts()
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
  getShifts () {
    const { id } = this.props
    const { thisWeek, nextWeek } = this.state
    api.getWeekShiftInfo(id, thisWeek, nextWeek)
      .then(res => {
        this.setState({ shifts: res,
          loaded: true })
      })
  }
  getNextWeekShifts () {
    const { id } = this.props
    const { thisWeek, nextWeek } = this.state
    let startDate = moment(thisWeek).add(1, 'week').format('YYYY-MM-DD')
    let endDate = moment(nextWeek).add(1, 'week').format('YYYY-MM-DD')
    this.setState({ loaded: false })
    api.getWeekShiftInfo(id, startDate, endDate)
      .then(res => {
        console.log(res, 'res new shifts')
        this.setState({ shifts: res,
          loaded: true })
      })
  }
  getLastWeekShifts () {
    const { id } = this.props
    const { thisWeek, nextWeek } = this.state
    let startDate = moment(thisWeek).add(1, 'week').format('YYYY-MM-DD')
    let endDate = moment(nextWeek).add(1, 'week').format('YYYY-MM-DD')
    this.setState({ loaded: false })
    api.getWeekShiftInfo(id, startDate, endDate)
      .then(res => {
        this.setState({ shifts: res,
          loaded: true })
      })
  }
  nextWeek (e) {
    e.preventDefault()
    let lastWeek = moment(this.state.lastWeek).add(1, 'week').format('YYYY-MM-DD')
    let thisWeek = moment(this.state.thisWeek).add(1, 'week').format('YYYY-MM-DD')
    let nextWeek = moment(this.state.nextWeek).add(1, 'week').format('YYYY-MM-DD')
    this.setState({ nextWeek: nextWeek,
      thisWeek: thisWeek,
      lastWeek: lastWeek })
    this.getNextWeekShifts()
  }
  lastWeek (e) {
    e.preventDefault()
    let lastWeek = moment(this.state.lastWeek).subtract(1, 'week').format('YYYY-MM-DD')
    let thisWeek = moment(this.state.thisWeek).subtract(1, 'week').format('YYYY-MM-DD')
    let nextWeek = moment(this.state.nextWeek).subtract(1, 'week').format('YYYY-MM-DD')
    this.setState({ nextWeek: nextWeek,
      thisWeek: thisWeek,
      lastWeek: lastWeek })
    this.getLastWeekShifts()
  }
  deleteShift (e, shiftId) {
    e.preventDefault()
    let { id } = this.props
    api.deleteShift(id, shiftId)
      .then(res => res)
  }
  acceptShiftSwap (e, shiftID) {
    e.preventDefault()
    let { id } = this.props
    api.acceptShiftSwap(id, shiftID)
      .then(res => window.alert('Swap sent for approval by manager'))
  }
  requestAvailability (e) {
    e.preventDefault()
    let { id } = this.props
    let { thisWeek, nextWeek } = this.state
    api.requestAvailability(id, thisWeek, nextWeek)
      .then(res => res)
  }
  render () {
    const { shifts, thisWeek, loaded } = this.state
    const { id } = this.props
    if (loaded) {
      if ((shifts.roles.indexOf('owner') > -1) || (shifts.roles.indexOf('manager') > -1)) {
        return (
          <div>
            <div className='weekRange'>
              <span><button className='titleButtonToggle' onClick={(e) => this.lastWeek(e)}>Last Week</button></span>
              <span className='currentDate'>{moment(thisWeek).format('MMM Do YYYY')}</span>
              <span><button className='titleButtonToggle' onClick={(e) => this.nextWeek(e)}>Next Week</button></span>
            </div>
            <div>
              {shifts.summaries.map((shift) => <div key={shift.shift_id}>
                <button className='columns3'>
                  <div>
                    <Link to={`/Calendar/${id}/Shifts/${moment(shift.Day).format('YYYY-MM-DD')}`}>
                      <button className='delete' class='btn'><i class='far fa-edit' onClick={(e) => this.deleteShift(e, shift.shift_id)} /></button>
                      <span className='day'>{moment(shift.Day).format('ddd, Do')}</span>
                      <div>
                        <span><div className='column3'>Total<br />Shifts<br /><strong>{shift.total_shifts}</strong></div></span>
                        <span><div className='column3'>Shift<br /> Capacity<br /><strong>{shift.total_capacity}</strong></div></span>
                        <span><div className='column3'>Assigned<br /> Staff<br /><strong>{shift.total_assigned_capacity}</strong></div></span>
                      </div>
                    
              </Link>
              <Delete onClick={(e) => this.deleteShift(e, shift.shift_id)} />
            </div>)}
            <Button onClick={e => this.requestAvailability(e)}>Request Availability</Button>
            <span className='datePicker'>
              <Button onClick={e => this.pasteWeek(e)}>Copy to:</Button>
              <DayPickerInput onDayChange={(day) => this.copyWeekStart(day)} />
            </span>
                  </div>
                </button>
              </div>
              )
              }
            </div>
          </div>
        )
      } else {
        return (
          <div>
            <Button onClick={(e) => this.lastWeek(e)}>Last Week</Button>
            <div>{moment(thisWeek).format('MMM Do YYYY')}</div>
            <Button onClick={(e) => this.nextWeek(e)}>Next Week</Button>
            {shifts.summaries.map((shift) => <div key={shift.shift_id}>
              <Button className='rows'>
                <Link className='rows'to={`/Calendar/${id}/Shifts/${moment(shift.Day).format('YYYY-MM-DD')}`}>
                  {<div className='weekViewButton'>
                    <div>{moment(shift.Day).format('ddd, Do')}
                      <div>Total Shifts:({shift.total_shifts})</div>
                      <div>Capacity:({shift.total_capacity})</div>
                      <div>Assigned Cap:({shift.total_assigned_capacity})</div>
                    </div>
                  </div>}
                </Link>
              </Button>
            </div>)}
          </div>
        )
      }
    } else {
      return (<div>Loading</div>)
    }
  }
}
export default WeekView

// import React, { Component } from 'react'
// import moment from 'moment'
// import { Delete, Button } from 'bloomer'

// import { Link } from 'react-router-dom'

// import api from './api'

// class WeekView extends Component {
//   constructor () {
//     super()
//     this.state = {
//       shifts: [],
//       thisWeek: moment(new Date()).startOf('week').format('YYYY-MM-DD'),
//       nextWeek: moment(new Date()).add(6, 'days').format('YYYY-MM-DD'),
//       lastWeek: moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
//       notesExist: false
//     }
//   }
//   componentDidMount () {
//     this.getShifts()
//   }
//   getShifts () {
//     const { id } = this.props
//     const { thisWeek, nextWeek } = this.state
//     api.getWeekShiftInfo(id, thisWeek, nextWeek)
//       .then(res => {
//         this.setState({ shifts: res })
//       })
//   }
//   nextWeek (e) {
//     e.preventDefault()
//     let nextWeek = moment(this.state.lasWeek).add(1, 'week')
//     let thisWeek = moment(this.state.thisWeek).add(1, 'week')
//     let lastWeek = moment(this.state.nextWeek).add(1, 'week')
//     this.setState({ nextWeek: nextWeek,
//       thisWeek: thisWeek,
//       lastWeek: lastWeek })
//     this.getShifts()
//   }
//   lastWeek (e) {
//     e.preventDefault()
//     let nextWeek = moment(this.state.lasWeek).subtract(1, 'week')
//     let thisWeek = moment(this.state.thisWeek).subtract(1, 'week')
//     let lastWeek = moment(this.state.nextWeek).subtract(1, 'week')
//     this.setState({ nextWeek: nextWeek,
//       thisWeek: thisWeek,
//       lastWeek: lastWeek })
//     this.getShifts()
//   }
//   deleteShift (e, shiftId) {
//     e.preventDefault()
//     let { id } = this.props
//     api.deleteShift(id, shiftId)
//       .then(res => res)
//   }
//   render () {
//     const { shifts, thisWeek, shiftSwapsIndex } = this.state
//     const { id, type } = this.props
//     if (shifts && shifts.length > 0) {
//       if (type === 'Employed Calendars') {
//         return (
//           <div>
//             <Button onClick={(e) => this.lastWeek(e)}>Last Week</Button>
//             <div>{moment(thisWeek).format('MMM Do YYYY')}</div>
//             <Button onClick={(e) => this.nextWeek(e)}>Next Week</Button>
//             <div>
//               Click on a Shift to Accept It
//               {shiftSwapsIndex.map((shiftSwap) => {
//                 if (shiftSwap.accepting_user) {
//                   return (
//                     <div>
//                       <div key={shiftSwap.id}>
//                         <Button isActive='true' value={shiftSwap.id}
//                           onClick={(e) => { if (window.confirm('Accept this shift?')) this.acceptShiftSwap(e, e.target.value) }}
//                         >{moment(shiftSwap.shift.start_time).format('MMM Do YYYY hh:mm a')} - {moment(shiftSwap.shift.end_time).format('MMM Do YYYY hh:mm a')}</Button>
//                       </div>
//                       {shifts.map((shift) => <div key={shift.shift_id}>
//                         <Link to={`/Calendar/${id}/Shifts/${moment(shift.Day).format('YYYY-MM-DD')}`}>
//                           {<div className='weekViewButton'>
//                             <div>{moment(shift.Day).format('ddd, Do')}
//                               <div>
//                                 <div>Total Shifts:({shift.total_shifts})</div>
//                                 <div>Capacity:({shift.total_capacity})</div>
//                                 <div>Assigned Cap:({shift.total_assigned_capacity})</div>
//                               </div>
//                             </div>
//                           </div>}
//                         </Link>
//                       </div>)}
//                     </div>
//                   )
//                 } else {
//                   return (
//                     <div>
//                       <div key={shiftSwap.id}>
//                         <Button isActive='false' value={shiftSwap.id}
//                           onClick={(e) => { if (window.confirm('Accept this shift?')) this.acceptShiftSwap(e, e.target.value) }}
//                         >{moment(shiftSwap.shift.start_time).format('MMM Do YYYY hh:mm a')} - {moment(shiftSwap.shift.end_time).format('MMM Do YYYY hh:mm a')}</Button>
//                       </div>
//                       {shifts.map((shift) => <div key={shift.shift_id}>
//                         <Link to={`/Calendar/${id}/Shifts/${moment(shift.Day).format('YYYY-MM-DD')}`}>
//                           {<div className='weekViewButton'>
//                             <div>{moment(shift.Day).format('ddd, Do')}
//                               <div>
//                                 <div>Total Shifts:({shift.total_shifts})</div>
//                                 <div>Capacity:({shift.total_capacity})</div>
//                                 <div>Assigned Cap:({shift.total_assigned_capacity})</div>
//                               </div>
//                             </div>
//                           </div>}
//                         </Link>
//                       </div>)}
//                     </div>
//                   )
//                 }
//               })}
//             </div>
//           </div>
//         )
//       } else {
//         return (
//           <div>
//             <Button onClick={(e) => this.lastWeek(e)}>Last Week</Button>
//             <div>{moment(thisWeek).format('MMM Do YYYY')}</div>
//             <Button onClick={(e) => this.nextWeek(e)}>Next Week</Button>
//             {shifts.map((shift) => <div key={shift.shift_id}>
//               <Link to={`/Calendar/${id}/Shifts/${shift.Day}`}>
//                 { <div className='weekViewButton'>
//                   <div>{moment(shift.Day).format('ddd, Do')}
//                     <div>
//                       <div>Total Shifts:({shift.total_shifts})</div>
//                       <div>Capacity:({shift.total_capacity})</div>
//                       <div>Assigned Cap:({shift.total_assigned_capacity})</div>
//                     </div>
//                   </div>
//                 </div>}
//               </Link>
//               <Delete onClick={(e) => this.deleteShift(e, shift.shift_id)} />
//             </div>)}
//           </div>
//         )
//       }
//     } else {
//       return (<div>Loading</div>)
//     }
//   }
// }

// export default WeekView
