import React, { Component, PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, ActivityIndicator, Platform, UIManager, LayoutAnimation } from 'react-native'
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import constant from '../utility/Constants'
import * as utils from '../utility/CommonFunctions'
import ImagePath from '../utility/ImagePath';

const { width } = Dimensions.get('window')

class CustomCalendar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentMonth: utils.newDate('new'),
      current: utils.newDate('new'),
      selectedDate: utils.stringFormat(utils.newDate('new')),
      HolidayList: ["2020-12-28", "2021-01-28", "2021-02-26"],
      calendarHolidays: [],
      agendaList: new Map(),
      viewCalendar: true,
    }
  };

  componentDidMount = () => {
    if (Platform.OS == "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    };
    this.state.HolidayList.forEach((item)=>{
      this.state.agendaList.set(item, {
        name: item, 
        agendas: [
          {type: 'agenda', title: 'Meeting with John', from: '2 PM', to: '3 PM', description: 'Session 1'}, 
          {type: 'holiday', title: 'Holiday', from: '2 PM', to: '3 PM', description: 'Holiday 1'}
        ]
      });
    });

    if(this.state.HolidayList.includes(this.state.selectedDate)){
      let currentAgenda = this.state.agendaList.get(this.state.selectedDate);
      this.setState({calendarHolidays: currentAgenda.agendas});
    }
  }

  getDayColor = (isDisabled, date) => {
    const isHoliday = this.state.HolidayList.length != 0 && this.state.HolidayList.includes(date.dateString)
    const isSunday = new Date(date.dateString).getDay() === 0
    const isSelected = date.dateString === this.selectedDate;
    if (isDisabled) {
      return constant.CALENDAR_THEME.DISABLED_COLOR
    }
    else if (isSelected) {
      return constant.CALENDAR_THEME.SELECTED_COLOR
    }
    else if (isSunday) {
      return constant.CALENDAR_THEME.SUNDAY_COLOR
    }
    else if (isHoliday) {
      return constant.CALENDAR_THEME.HOLIDAY_COLOR
    }
    else return constant.CALENDAR_THEME.ENABLED_COLOR
  };

  onDayPress = (date) => {

    if(this.state.agendaList.has(date.dateString)){
      let selectedAgenda = this.state.agendaList.get(date.dateString);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({calendarHolidays: selectedAgenda.agendas});
    }
    else{
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({calendarHolidays: []});
    }
  };


  onArrowPress = async (onPress, side) => {
    if (side === 'left') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.state.currentMonth.set('month', this.state.currentMonth.get('month') - 1);
    }
    else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.state.currentMonth.set('month', this.state.currentMonth.get('month') + 1);
    }
    this.setState({selectedDate: ''})
    onPress()
  };

  renderDayComponent = (date, state) => {
    const selectedDateStyle = styles.date;
    const startOfMonth = moment(this.state.currentMonth).clone().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment(this.state.currentMonth).clone().endOf('month').format('YYYY-MM-DD');
    const curDateString = moment(date.dateString).format('YYYY-MM-DD');
    let isDisabled;
    if(utils.isBefore(curDateString, startOfMonth) || utils.isAfter(curDateString, endOfMonth)) {
      isDisabled = true;
    }
    date.color = this.getDayColor(isDisabled, date);
    const textStyle = [styles.dayTextStyle, { color: date.color }]
    if (state === 'disabled') {
      return null
    }
    return (
      <View style={styles.dayContainer}>
        <View style={{ height: 10 }}>
          {date.dateString === utils.stringFormat(utils.newDate('new'))
            ? (
              <Text style={styles.todayText}>
                TODAY
              </Text>
            )
            : null
          }
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log('date', date)
            this.setState({selectedDate: date.dateString});
            this.onDayPress(date);
          }}
          disabled={isDisabled}
        >
          <View style={selectedDateStyle}>
            <Text style={textStyle}>
              {date.day}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderArrow = (side) => {
    const leftArrowSource = ImagePath.CALENDAR_LEFT
    const source = side === 'right' ? ImagePath.CALENDAR_RIGHT : leftArrowSource
    return (
      <Image
        source={source}
      />
    )
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log(nextState.selectedDate)
    console.log(this.state.selectedDate)
    // if(nextState.selectedDate != this.state.selectedDate){
    //   return true;
    // }
    return true;
  }

  cardView = (item) => {
    let timings = item.type == 'agenda' ? `${item.from} - ${item.to}` : 'All day';
    return (
      <View style={styles.agendaCard}>
        <View style={styles.agendaView}>
          <View style={{width: 10, backgroundColor: item.type == 'agenda' ? '#7BBAF4' : '#F068B2', marginTop: 10}} />
          <View style={styles.cardView}>
            <Text style={styles.agendaText}>{timings}</Text>
            <Text style={styles.agendaTitle}>{item.title}</Text>
            <Text style={[styles.agendaText,{fontWeight: '500',}]}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  onPressViewCalendar = () => {
    this.setState({viewCalendar: !this.state.viewCalendar , currentMonth: utils.newDate('new'), selectedDate: '' });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  renderAgendaList = () => {
    if(this.state.calendarHolidays.length > 0){
      return(
        <FlatList
          keyboardShouldPersistTaps='always'
          data={this.state.calendarHolidays}
          extraData={this.state.calendarHolidays}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => this.cardView(item)}
          ListFooterComponent={() => {
              return <View style={{ height: 60 }} />;
          }}
        />
      );
    }
    else {
      return (
        <Text style={{margin: 20, fontSize: 16}}>No Agendas/Holidays</Text>
      )
    }
  };

  render() {
    const {viewCalendar, selectedDate} = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.viewCalendarBtn} onPress={()=>this.onPressViewCalendar()}>
            <Image source={ImagePath.CALENDAR_ICON} style={{height: 35, width: 35}} resizeMode={'contain'}/>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>View full calendar</Text>
            <Image source={ImagePath.ARROW_DOWN} style={{height: 15, width: 20,transform: [{ rotateX: viewCalendar ? '180deg' : '0deg'},]}}/>
        </TouchableOpacity>
        {viewCalendar && 
            <>
              <Calendar
                renderArrow={this.renderArrow}
                onPressArrowLeft={(substractMonth) => this.onArrowPress(substractMonth, 'left')}
                onPressArrowRight={(addMonth) => this.onArrowPress(addMonth, 'right')}
                theme={constant.CALENDAR_THEME.HEADER_THEME}
                style={{ height: 400, backgroundColor: 'white' }}
                dayComponent={({ date, state }) => this.renderDayComponent(date, state) }
                monthFormat={constant.DATE_FORMATS.CALENDAR_MONTH_FORMAT}
              />
              {selectedDate != '' && (
                <View style={{ flex: 1, }}>
                  <Text style={{fontSize: 18, margin: 20}}>{utils.changeDateFormat(this.state.selectedDate, 'DD MMM YYYY')}</Text>
                  {this.renderAgendaList()}
                </View>
              )}
            </>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    width: width / 7,
    height: width / 7 - 20
  },
  dayTextStyle: {
    fontSize: 14,
    textAlign: 'center'
  },
  date: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    padding: 5
  },
  selectedDate: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: constant.CALENDAR_THEME.SELECTED_COLOR
  },
  cardView: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  agendaText: {
    color: 'black',
    fontSize: 13,
  },
  agendaTitle: {
    color: 'black',
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold'
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  viewCalendarBtn: {
    flexDirection:'row', 
    alignItems: 'center',
    height: 50,
    marginBottom: 20, 
    justifyContent: 'space-between', 
    paddingHorizontal: 20
  },
  agendaView:{ 
    borderBottomColor: '#CACCCD', 
    borderBottomWidth: 1, 
    flexDirection: 'row', 
    paddingBottom: 10
  },
  agendaCard: {
    flexDirection: 'column', 
    height: 100, 
    paddingHorizontal: 20, 
    marginTop: 10
  },
  todayText: { 
    fontSize: 9, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: constant.CALENDAR_THEME.SELECTED_COLOR 
  }
})

export default CustomCalendar;