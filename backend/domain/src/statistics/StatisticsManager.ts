import {DailyStatistics, VisitorsStatistics} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {StoreManagerModel, StoreOwnerModel, AdminModel, VisitorsStatisticsModel} from "dal"
import { loggerW } from "../api-int/internal_api";
const logger = loggerW(__filename)


export class StatisticsManager {
    private realTimeAdmins :Map<string, string>;        // admin username -> junk
    private realTimeStatistics :VisitorsStatistics;

    constructor() {
        this.realTimeAdmins = new Map();
    }

    getRealTimeStatisticsSubscribers() {
        return Array.from(this.realTimeAdmins.keys());
    }

    getDailyVisitorsStatistics() {
        return this.realTimeStatistics;
    }

    clearDailyRealTimeStatisticsSubscription(adminUsername: string) {
        this.realTimeAdmins.delete(adminUsername);
    }

    async newStatisticsRequest(adminUsername: string, fromDate: Date, toDate: Date): Promise<DailyStatistics[]> {
        const isRealTime: boolean = this.isDateToday(toDate);

        const statistics: DailyStatistics[] = await this.generateStatistics(fromDate, toDate);
        if (isRealTime && statistics) {
            const todayStatistics: DailyStatistics = statistics[statistics.length-1];
            this.realTimeStatistics = todayStatistics.statistics;
            this.realTimeAdmins.set(adminUsername, adminUsername)
        }
        return statistics;
    }

    /**
     * statistics in ascending order
     * @param fromDate
     * @param toDate
     */
    private async generateStatistics(fromDate: Date, toDate: Date): Promise<DailyStatistics[]> {
        let dailyStatistics: DailyStatistics[] = [];
        const statsModels = await this.getStatsModelsByDateRange(fromDate, toDate);
        if (statsModels) {
            statsModels.forEach(stat => {
                const statistics: VisitorsStatistics = {
                    guests: stat.guests,
                    registeredUsers: stat.registeredUsers,
                    managers: stat.managers,
                    owners: stat.owners,
                    admins: stat.admins
                }
                dailyStatistics.push({date: stat.date, statistics})
            })
        }
        return dailyStatistics;
    }

    async updateRegisteredUserVisit(username: string): Promise<boolean> {
        logger.info(`updating new visit by ${username}`)

        const isStoreManager: boolean = await this.isUserStoreManager(username);
        const isStoreOwner: boolean = await this.isUserStoreOwner(username);
        const isAdmin: boolean = await this.isUserAdmin(username);

        if (!isStoreManager && !isStoreOwner && !isAdmin)
            await this.addRegisteredUserVisit();
        else if (isStoreManager && !isStoreOwner && !isAdmin)
            await this.addStoreManagerVisit();
        else if (isStoreOwner && !isAdmin)
            await this.addStoreOwnerVisit();
        else if (isAdmin)
            await this.addAdminVisit();
        else {
            logger.error(`${username} is not registered in DB`)
            return false;
        }

        return this.isNeedToUpdate();
    }

    async updateGuestVisit(): Promise<boolean> {
        logger.info(`updating new guest visit`)
        await this.addGuestVisit();
        return this.isNeedToUpdate();
    }

    //region check user type
    private async isUserStoreManager(username: string): Promise<boolean> {
        try {
            const manager = await StoreManagerModel.findOne({username});
            return manager ? true : false;
        } catch (e) {
            logger.error(`isUserStoreManager: DB ERROR: ${e}`)
            return false;
        }
    }

    private async isUserStoreOwner(username: string): Promise<boolean> {
        try {
            const owner = await StoreOwnerModel.findOne({username});
            return owner ? true : false;
        } catch (e) {
            logger.error(`isUserStoreManager: DB ERROR: ${e}`)
            return false;
        }
    }

    private async isUserAdmin(username: string): Promise<boolean> {
        try {
            const admin = await AdminModel.findOne({username});
            return admin ? true : false;
        } catch (e) {
            logger.error(`isUserStoreManager: DB ERROR: ${e}`)
            return false;
        }
    }

    //endregion

    //region update visits

    private async addGuestVisit() {
        // Array.from(this.realTimeStatistics.values()).forEach(stat => stat.guests++)
        this.realTimeStatistics.guests++;
        try {       // add to db
            const todayStatsModel = await this.getTodayStatsModel();
            todayStatsModel.guests = todayStatsModel.guests+1;
            await todayStatsModel.save();
        } catch (e) {
            logger.error(`addGuestVisit DB ERROR: ${e}`)
        }
    }

    private async removeGuestVisit() {
        // Array.from(this.realTimeStatistics.values()).forEach(stat => stat.guests--)
        this.realTimeStatistics.guests--;
        try {       // add to db
            const todayStatsModel = await this.getTodayStatsModel();
            todayStatsModel.guests = todayStatsModel.guests-1;
            await todayStatsModel.save();
        } catch (e) {
            logger.error(`removeGuestVisit DB ERROR: ${e}`)
        }
    }

    private async addRegisteredUserVisit() {
        await this.removeGuestVisit();
        // Array.from(this.realTimeStatistics.values()).forEach(stat => stat.registeredUsers++)
        this.realTimeStatistics.registeredUsers++;
        try {       // add to db
            const todayStatsModel = await this.getTodayStatsModel();
            todayStatsModel.registeredUsers = todayStatsModel.registeredUsers+1;
            await todayStatsModel.save();
        } catch (e) {
            logger.error(`addRegisteredUserVisit DB ERROR: ${e}`)
        }
    }

    private async addStoreManagerVisit() {
        await this.removeGuestVisit();
        // Array.from(this.realTimeStatistics.values()).forEach(stat => stat.managers++)
        this.realTimeStatistics.managers++;
        try {       // add to db
            const todayStatsModel = await this.getTodayStatsModel();
            todayStatsModel.managers = todayStatsModel.managers+1;
            await todayStatsModel.save();
        } catch (e) {
            logger.error(`addStoreManagerVisit DB ERROR: ${e}`)
        }
    }

    private async addStoreOwnerVisit() {
        await this.removeGuestVisit();
        // Array.from(this.realTimeStatistics.values()).forEach(stat => stat.owners++)
        this.realTimeStatistics.owners++;
        try {       // add to db
            const todayStatsModel = await this.getTodayStatsModel();
            todayStatsModel.owners = todayStatsModel.owners+1;
            await todayStatsModel.save();
        } catch (e) {
            logger.error(`addStoreOwnerVisit DB ERROR: ${e}`)
        }
    }

    private async addAdminVisit() {
        await this.removeGuestVisit();
        // Array.from(this.realTimeStatistics.values()).forEach(stat => stat.admins++)
        this.realTimeStatistics.admins++;
        try {       // add to db
            const todayStatsModel = await this.getTodayStatsModel();
            todayStatsModel.admins = todayStatsModel.admins+1;
            await todayStatsModel.save();
        } catch (e) {
            logger.error(`addAdminVisit DB ERROR: ${e}`)
        }
    }

    //endregion

    private async getStatsModelsByDateRange(fromDate: Date, toDate: Date): Promise<any> {
        try {
            const cleanFromDate: Date = this.getCleanDate(fromDate);
            const cleanToDate: Date = this.getCleanDate(toDate);
            const statsModels = await VisitorsStatisticsModel
                .find({ date: { $gte: cleanFromDate, $lte: cleanToDate } })
                .sort({ date: 'asc' })
            return statsModels;
        } catch (e) {
            logger.error(`getStatsModelsByDateRange: DB ERROR: ${e}`)
            return undefined;
        }
    }

    private async getTodayStatsModel(): Promise<any> {
        try {
            const today: Date = this.getCleanDate(new Date());
            let manager = await VisitorsStatisticsModel.findOne({today});
            if (!manager) {
                logger.info(`creating visitor statistics for date: {${today}}`)
                manager = new VisitorsStatisticsModel({date: today, guests: 0, registeredUsers: 0, managers: 0, owners: 0, admins: 0})
            }
            return manager;
        } catch (e) {
            logger.error(`getTodayStatsModel: DB ERROR: ${e}`)
            return undefined;
        }
    }

    private getCleanDate(date: Date): Date {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    private isDateToday(toDate: Date): boolean {
        const today: Date = new Date();
        return toDate.getDate() === today.getDate() &&
            toDate.getMonth() === today.getMonth() &&
            toDate.getFullYear() === today.getFullYear();
    }

    private isNeedToUpdate(): boolean {
        return this.realTimeAdmins.size > 0;
    }
}