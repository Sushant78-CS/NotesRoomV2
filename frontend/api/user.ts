import { api } from "./client";

export const createGroup = (groupName: string) => {
    return api.post("/user/create-group", { groupName });
};

export const joinGroup = (inviteCode: string) => {
    return api.post("/user/join-group", { inviteCode });
};

export const leaveGroup = (groupId: number) => {
    return api.delete(`/user/group/${groupId}`);
};

export const getAllGroups = () => {
    return api.get(`/user/all-group`);
};

export const getAllJoinedGroups = () => {
    return api.get(`/user/joined-group`);
};

export const getGroupDetail = (groupId: number) => {
    return api.get(`/user/group/${groupId}`);
};

export const getMembersInGroup = (groupId: number) => {
    return api.get(`/user/group/${groupId}/members`);
};

export const getFilesInGroup = (groupId: number) => {
    return api.get(`/user/group/${groupId}/files`);
};

export const syncUser = async (username: string, email: string) => {
    try {
        return await api.post("auth/sync-user", { username, email })
    } catch (err: any) {
        console.log("error in sync user api : ", err)
        throw err;
    }
}