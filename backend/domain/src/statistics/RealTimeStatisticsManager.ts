import {VisitorsStatistics} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import { loggerW } from "../api-int/internal_api";
const logger = loggerW(__filename)


export class RealTimeStatisticsManager {

    private realTimeStatistics :Map<string, VisitorsStatistics>;

    constructor() {
        this.realTimeStatistics = new Map();
    }

    getVisitorsStatistics(adminUsername: string) {
        return this.realTimeStatistics.get(adminUsername);
    }

    async updateRegisteredUserVisit(username: string): boolean {
        if (!this.isNeedToUpdate())
            return false;

        logger.info(`updating new visit by ${username}`)

        const isStoreManager: boolean = await this.isUserStoreManager(username);
        const isStoreOwner: boolean = await this.isUserStoreOwner(username);
        const isAdmin: boolean = await this.isUserAdmin(username);

        if (!isStoreManager && !isStoreOwner && !isAdmin)
            this.addRegisteredUserVisit();
        else if (isStoreManager && !isStoreOwner && !isAdmin)
            this.addStoreManagerVisit();
        else if (isStoreOwner && !isAdmin)
            this.addStoreOwnerVisit();
        else if (isAdmin)
            this.addAdminVisit();
        else
            logger.error(`${username} is not registered in DB`)
    }

    updateGuestVisit(): boolean {
        if (!this.isNeedToUpdate())
            return false;

        logger.info(`updating new guest visit`)

        this.addGuestVisit();
        return true;
    }

    private async isUserStoreManager(username: string): boolean {


    }

    private async isUserStoreOwner(username: string): boolean {

    }

    private async isUserAdmin(username: string): boolean {

    }

    private addGuestVisit() {
        Array.from(this.realTimeStatistics.values()).forEach(stat => stat.guests++)
    }

    private removeGuestVisit() {
        Array.from(this.realTimeStatistics.values()).forEach(stat => stat.guests--)
    }

    private addRegisteredUserVisit() {
        this.removeGuestVisit();
        Array.from(this.realTimeStatistics.values()).forEach(stat => stat.registeredUsers++)
    }

    private addStoreManagerVisit() {
        this.removeGuestVisit();
        Array.from(this.realTimeStatistics.values()).forEach(stat => stat.managers++)
    }

    private addStoreOwnerVisit() {
        this.removeGuestVisit();
        Array.from(this.realTimeStatistics.values()).forEach(stat => stat.owners++)
    }

    private addAdminVisit() {
        this.removeGuestVisit();
        Array.from(this.realTimeStatistics.values()).forEach(stat => stat.admins++)
    }

    private isNeedToUpdate(): boolean {
        return this.realTimeStatistics.size > 0;
    }
}