import prisma from "../config/prisma.js"

const create = async (session) => {

    return await prisma.sessionUser.create({
        data: session
    })
}

const remove = async (userId, token) => {
    return await prisma.sessionUser.delete({
        where: {
            userId,
            token
        }
    })
}

const getByToken = async (token) => {
    return await prisma.sessionUser.findUnique({
        where: {
            token
        }
    })
}

const edit = async (session) => {
    return await prisma.sessionUser.update({
        where: {
            id: session.id
        },
        data: session
    })
}


export default {create, remove, edit, getByToken}