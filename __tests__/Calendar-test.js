import 'react-native';
import React from 'react';
import CustomCalendar from '../src/reusableComponents/CustomCalendar'; 
import renderer from 'react-test-renderer';

test('Calendar snaapshot', ()=>{
    const snap = renderer.create(<CustomCalendar />).toJSON();
    expect(snap).toMatchSnapshot();
});
