import React, {useEffect, useState} from "react";
import StatisticsPage from "./statistics-page";
import * as api from "../../utils";
import * as Message from "../../components/custom-alert/custom-alert";
import {StatisticsPageCtx} from "./statistics-page-ctx";
import moment from "moment";
import * as wssClient from "../../utils/wss.client";
function forPresentation(stats) {
    let res = [];
    for (let i = 0; i < 20; i++) {
        res.push(
            {
                date: moment().add(i + 1, "day").format("DD MMM YYYY"),
                statistics: {
                    guests: getRandomInt(1, 20),
                    registeredUsers: getRandomInt(1, 20),
                    managers: getRandomInt(1, 20),
                    owners: getRandomInt(1, 20),
                    admins: getRandomInt(1, 20)
                }
            }
        )
    }
    const result = stats.map(s => {
        return {
            date: moment(s.date).format("DD MMM YYYY"),
            statistics: s.statistics
        }
    });
    return [...result, ...res];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const StatisticsPageContainer = () => {

    const [dates, setDates] = useState([]);
    const [rangeStatistics, setRangeStatistics] = useState([]);
    const [dayStatistics, setDayStatistics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const from = dates && dates[0] && dates[0].toDate();
            const to = dates && dates[1] && dates[1].toDate();
            if (from && to) {
                const rangeRes = await api.getStatistics(from, to);
                parseRangeResult(rangeRes);
            }

            const today = new Date();
            const dayRes = await api.getStatistics(today, today);
            parseDayResult(dayRes);
        }

        fetchData();
    }, [dates]);

    useEffect(() => {
        wssClient.setOnStatsUpdate(handleStatsUpdate);

        return async () => {
            await api.stopStatistics();
            wssClient.setOnStatsUpdate(undefined);
        };
    }, [])

    const getDayStatistics = (stats) => {
        if (!stats || !stats[0]) return [];
        const {guests, registeredUsers, managers, owners, admins} = stats[0].statistics;
        return [guests, registeredUsers, managers, owners, admins];
    }

    const parseRangeResult = (result) => {
        if (result.data.error) {
            Message.error(result.data.error.message);
        } else {
            const stats = result.data.data.statistics;
            setRangeStatistics(withNewDateFormat(stats));
        }
    }

    const withNewDateFormat = (stats) => {
        // return forPresentation(stats);
        return stats.map(s => {
            return {
                date: moment(s.date).format("DD MMM YYYY"),
                statistics: s.statistics
            }
        })
    }

    const parseDayResult = (result) => {
        if (result.data.error) {
            Message.error(result.data.error.message);
        } else {
            const stats = result.data.data.statistics;
            setDayStatistics(getDayStatistics(stats));
        }
    }

    const handleStatsUpdate = (res) => {
        const updatedStats = JSON.parse(res.data).statistics;
        const {guests, registeredUsers, managers, owners, admins} = updatedStats;
        setDayStatistics([guests, registeredUsers, managers, owners, admins]);
        updateRangeStats(updatedStats);
    }

    const updateRangeStats = (updatedStats) => {
        const today = moment(new Date()).format('DD MMM YYYY');
        setRangeStatistics(prevRangeStatistics => {
            return prevRangeStatistics.map(s => {
                return s.date == today ? {date: s.date, statistics: updatedStats} : s;
            })
        })
    }

    const providerState = {
        dates: dates,
        setDates: setDates,
        dayStatistics: dayStatistics,
        rangeStatistics: rangeStatistics,
        updateRangeStatistics: setRangeStatistics,
    };

    return (
        <StatisticsPageCtx.Provider value={providerState}>
            <StatisticsPage/>
        </StatisticsPageCtx.Provider>
    );
}

export default StatisticsPageContainer;