export type Post = {
    id: string;
    uid: string;
    name: string;
    content: string;
    createdAt: string | null;
    pending: boolean;
};

export type UserProfile = {
    uid: string;
    displayName: string;
    bio: string;
};
