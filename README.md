# calendarRN
This is basic calendar component with some customizations. Library used for rendering the calendar is wix/react-native-calendars.

# How to run this code?
1. Clone/Pull this code into your local system. Make sure you have react-native installed on your system.
2. In your terminal, go to the project's folder and run 'npm install'.
3. After the installation is done, run 'npm start'.
4. Open another instance of terminal in the same folder and run 'react-native run-ios' or 'react-native run-android'(In case of android, make sure an android emulator is already running).

# Functionality
This custom calendar shows us the agendas/holidays below the calendar component. Some specifications of this component are :
1. Current day is denoted with a 'Today' label above it.
2. Any date that has an agenda/holiday is shown in orange color.
3. Selected date is shown below the calendar in format - 'DD MMM YYYY' and agendas/holidays are shown below this date.
4. Holidays are shown with a pink left border and holidays with a blue left border. If no holidays or agendas are present for the day, a message 'No Agendas/Holidays' is shown.
