import {AppUser} from "../../../auth/account/shared/appuser.model";

export interface Todo {
    id?: number;
    title?: string;
    shortDesc?: string;
    content: string;
    contributors: AppUser[];
    creator: AppUser;
    lastUpdatedBy: AppUser;
    createdAt: Date;
    updatedAt: Date;
    startDate?: Date;
    endDate?: Date;
}
