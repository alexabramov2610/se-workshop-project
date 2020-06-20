import React, {useContext, useEffect, useState} from 'react';
import {Button, DatePicker, Divider, Space} from 'antd';
import {Statistic, Segment} from 'semantic-ui-react';
import Chart from "react-apexcharts";
import {StatisticsPageCtx} from "./statistics-page-ctx";
import moment from "moment";

const {RangePicker} = DatePicker;
const dateFormat = "DD/MM/YY";
const labels = ['Guests', 'Registered', 'Owners', 'Managers', 'Admins'];

const StatisticsPage = () => {

    const props = useContext(StatisticsPageCtx);
    const [barView, setBarView] = useState(false);

    const getStatData = () => {
        const {guests, registeredUsers, managers, owners, admins} = getRangeTotal(props.rangeStatistics);
        const containerStyle = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
        };
        return (
            <>
                <h4>Range Total</h4>
                <Segment style={containerStyle}>
                    <Statistic>
                        <Statistic.Value>{guests}</Statistic.Value>
                        <Statistic.Label>Guests</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{registeredUsers}</Statistic.Value>
                        <Statistic.Label>Registered</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{owners}</Statistic.Value>
                        <Statistic.Label>Owners</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{managers}</Statistic.Value>
                        <Statistic.Label>Managers</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{admins}</Statistic.Value>
                        <Statistic.Label>Admins</Statistic.Label>
                    </Statistic>
                </Segment>
            </>
        );
    }
    const getTopDatesAndViewSettings = () => {
        const wrapperStyle = {width: "200px"};
        const pickerStyle = {width: "100%"};
        const containerStyle = {display: "flex", flexDirection: "row"};
        return (
            <Space style={containerStyle}>
                <div style={wrapperStyle}>
                    <h4>Choose Range</h4>
                    <RangePicker
                        loading
                        format={dateFormat}
                        disabledDate={disabledDates}
                        style={pickerStyle}
                        onCalendarChange={value => props.setDates(value)}
                    />
                </div>
            </Space>
        );
    }
    const getCharts = () => {
        const segmentStyle = {
            margin: "0px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        };
        const containerStyle = {display: "flex", flexDirection: "row", justifyContent: "space-between"};
        return (
            <div style={containerStyle}>
                <div style={{width: "66.5%"}}>
                    <h4>Range Statistics</h4>
                    <Segment style={{...segmentStyle}}>
                        <Button type={"primary"} size="small" style={{alignSelf: "flex-start"}}
                                onClick={() => setBarView(!barView)}>Horizontal / Vertical</Button>
                        <Chart
                            options={barChartState.options}
                            series={barChartState.series}
                            type="bar"
                            width="1200"
                            height="376"
                        />
                    </Segment>
                </div>
                <div style={{width: "32.5%"}}>
                    <h4>Day Statistics</h4>
                    <Segment style={{...segmentStyle}}>
                        <Chart
                            options={pieChartState.options}
                            series={pieChartState.series}
                            labels={labels}
                            type="pie"
                            width="500"
                            height="412"
                        />
                    </Segment>
                </div>
            </div>
        );
    }

    const getRangeTotal = (stats) => {
        return stats.reduce((acc, curr) => {
            const {statistics} = curr;
            acc.guests += statistics.guests;
            acc.registeredUsers += statistics.registeredUsers;
            acc.managers += statistics.managers;
            acc.owners += statistics.owners;
            acc.admins += statistics.admins;
            return acc;
        }, {guests: 0, registeredUsers: 0, managers: 0, owners: 0, admins: 0});
    }
    const getRangeStatistics = (stats) => {
        const dates = stats.map(s => moment(new Date(s.date)).format("DD MMM YYYY"));
        const guests = stats.map(s => s.statistics.guests);
        const registeredUsers = stats.map(s => s.statistics.registeredUsers);
        const owners = stats.map(s => s.statistics.owners);
        const admins = stats.map(s => s.statistics.admins);
        const managers = stats.map(s => s.statistics.managers);
        return {guests, registeredUsers, managers, owners, admins, dates};
    }
    const disabledDates = current => {
        return current > moment().endOf("day");
    }

    const rangeStatistics = getRangeStatistics(props.rangeStatistics);
    const barChartState = {
        series: [{
            name: labels[0],
            data: rangeStatistics.guests
        }, {
            name: labels[1],
            data: rangeStatistics.registeredUsers
        }, {
            name: labels[2],
            data: rangeStatistics.managers
        }, {
            name: labels[3],
            data: rangeStatistics.owners
        }, {
            name: labels[4],
            data: rangeStatistics.admins
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true,
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: barView,
                },
            },
            xaxis: {
                type: 'category',
                categories: props.rangeStatistics.map(s => s.date),
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        },


    };
    const pieChartState = {
        series: props.dayStatistics,
        options: {labels: ['Guests', 'Registered', 'Owners', 'Managers', 'Admins']}
    };

    return (
        <React.Fragment>
            <Divider orientation="left" style={{fontSize: "35px", marginTop: "0px"}}>Statistics</Divider>
            {getTopDatesAndViewSettings()}
            {getStatData()}
            {getCharts()}
        </React.Fragment>
    );
}

export default StatisticsPage;