import { UserLocations } from '../../entity/user-locations.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Page } from '../../dto/page';
export declare class UserLocationsService {
    private readonly userLocationsRepository;
    constructor(userLocationsRepository: Repository<UserLocations>);
    saveUserLocations(userId: any, description: string, locations: string, configs: string): Promise<UserLocations>;
    updateUserLocations(userLocations: UserLocations): Promise<UpdateResult> | undefined;
    getUserLocationsList(page: Page, data?: any): Promise<any>;
    getUserLocations(data: {
        [props: string]: any;
    }): Promise<UserLocations>;
    deleteUserLocations(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    exportUserLocationsList(): Promise<any>;
}
