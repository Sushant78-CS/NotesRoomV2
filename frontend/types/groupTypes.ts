export interface Group {
    id: number;
    groupName: string;
}

export interface GroupDetail {
    id: number;
    groupName: string;
    createdById: number;
    createdByUsername: string;
    inviteCode: string;
    memberCount: number;
}

export interface GroupMember {
    id: number;
    clerkId: string;
    username: string;
    role: string;
}

export interface FileType {
    id: number;
    fileUrl: string;
    fileName: string;
    uploadedByUsername: string;
}

export interface GroupFileResponse {
    data: FileType[];
    admin: boolean;
}
