export class Schedule {
    id: string;
    date: Date;
    newDate: Date;
    required: boolean;
    userAvailability: boolean;

    userFunction : string;
    newUserFunction : string;
    deleting : boolean;
}