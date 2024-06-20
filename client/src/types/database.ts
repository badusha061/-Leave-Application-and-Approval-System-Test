export interface User {
    id : number
    username : string,
    email : string,
    is_admin : boolean
}

export interface EmployeeLeave{
    id : number,
    user : User,
    phone : string,
    department : string,
    email : string,
    type_of_leave : string,
    reason : string,
    first_day_of_absence: string,
    last_day_of_absence: string,
    created_at : string,
    leave_approval: boolean
}



type LeaveData = {
    user : User,
    type_of_leave : string,
    total: number;
    approved: number;
    pending: number;
};