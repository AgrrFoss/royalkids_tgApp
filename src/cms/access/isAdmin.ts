import { Access } from 'payload';
export const isAdmin: Access = async ({req: {user}} ) => {
    return Boolean(user)
}

export const isPublishedOrModerator: Access = ({req: {user}}) => {
    if (user) {
        return true
    }
    return {
        status: {
            equals: 'published'
        }
    }
}