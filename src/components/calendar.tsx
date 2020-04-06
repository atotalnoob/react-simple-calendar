import React from 'react';
import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';

const Frame = styled.div`
  width: 300px;
  border: 1px solid lightgrey;
  box-shadow: 2px 2px 2px #eee;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 10px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
  background-color: #f5f6fa;
`;

const Button = styled.div`
  cursor: pointer;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;
// This magical width calculation is the size of the calendar divided by number of days displayed. In a normal app, I'd make the 300px a variable (or make the whole thing flex) and utilize it that way so its less 'magic stringy'.
const Day = styled.div`
  width: calc(300px / 7);
  height: calc(300px / 7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  border-radius: 25%;
  ${(props) =>
    //@ts-ignore
    props.isToday && css``}

  ${(props) =>
    //@ts-ignore
    props.isSelected &&
    css`
      background-color: #007bff;
    `}
`;

export function Calendar() {
  const MAX_DISPLAYED = 35;
  const COUNT_OF_DAYS_OF_MONTHS = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  const COUNT_OF_DAYS_OF_MONTHS_LEAP = [
    31,
    29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const MONTHS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];

  const now = new Date();
  const [date, setDate] = useState(now);

  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));
  const [currentMonth, setCurrentMonth] = useState(getCurrrentMonth(date));

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
    setCurrentMonth(getCurrrentMonth(now));
  }, [date, now]);

  function getStartDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }
  function getCurrrentMonth(date: Date): number {
    return date.getMonth();
  }

  function isLeapYear(year: number): Boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days_of_months = isLeapYear
    ? COUNT_OF_DAYS_OF_MONTHS_LEAP
    : COUNT_OF_DAYS_OF_MONTHS;

  function getPreviousMonthDay(d: number, selectedMonth: number): number {
    let previousMonthIndex = selectedMonth - 1;
    if (previousMonthIndex < 0) {
      previousMonthIndex = days_of_months.length + previousMonthIndex; // somewhat confusing + sign, previousMonthIndex will be negative
    }
    return days_of_months[previousMonthIndex] + d; // somewhat confusing + sign, d will be negative
  }
  function getFutureMonthDay(d: number, selectedMonth: number): number {
    return d - days_of_months[selectedMonth];
  }
  return (
    <Frame>
      <Header>
        <Button onClick={() => setDate(new Date(year, month - 1, day))}>
          &lsaquo;
        </Button>
        <div>
          {MONTHS[month]} {year}
        </div>
        <Button onClick={() => setDate(new Date(year, month + 1, day))}>
          &rsaquo;
        </Button>
      </Header>
      <Body>
        {DAYS_OF_WEEK.map((d) => {
          return (
            <Day key={d}>
              <strong>{d}</strong>
            </Day>
          );
        })}
        {Array(MAX_DISPLAYED)
          .fill(null)
          .map((_, i) => {
            const d = i - (startDay - 2);
            const isToday = d === now.getDate() && currentMonth === month;
            const isSelected = d === day;
            const isPartOfCurrentMonth = d > 0 && d <= days_of_months[month];

            let displayDay = d;

            if (displayDay <= 0) {
              displayDay = getPreviousMonthDay(displayDay, month);
            } else if (displayDay > days_of_months[month]) {
              displayDay = getFutureMonthDay(displayDay, month);
            }

            return (
              <Day
                key={i}
                //@ts-ignore
                isToday={isToday}
                isSelected={isSelected}
                onClick={() => {
                  const newDate = new Date(year, month, d);
                  console.log(newDate.toISOString());
                  setDate(newDate);
                }}
                className={classNames('day', {
                  today: isToday,
                  selected: isSelected
                })}
              >
                <span
                  className={classNames({
                    otherMonth: !isPartOfCurrentMonth
                  })}
                >
                  {displayDay}
                </span>
              </Day>
            );
          })}
      </Body>
    </Frame>
  );
}
