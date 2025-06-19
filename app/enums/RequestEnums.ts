export enum RequestStatus {
    New = 'new',
    InProgress = 'in_progress',
    Approved = 'approved',
    Rejected = 'rejected',
}

export const RequestStatusRu: Record<RequestStatus, string> = {
    [RequestStatus.New]: 'Новая',
    [RequestStatus.InProgress]: 'В процессе',
    [RequestStatus.Approved]: 'Утверждена',
    [RequestStatus.Rejected]: 'Отклонена',
};