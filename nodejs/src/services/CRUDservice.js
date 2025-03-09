import bcrypt from "bcrypt"
import db from "../models/index"
const salt = bcrypt.genSaltSync(10)

let hashUserPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(password, salt)
            resolve(hash)
        } catch (error) {
            reject(error);
        }
    });
};


let createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password)
            db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === "1" ? true : false,
                roleID: "R" + data.role,
            })
            resolve("Create user successfully")
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            })
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}
let getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                raw: true
            })
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.password && data.password !== data.currentPassword) {
                let hashPassword = await hashUserPassword(data.password)
                data.password = hashPassword
            }
            let user = await db.User.update(
                {
                    roleID: "R" + data.role,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === "1" ? true : false,
                    email: data.email,
                    password: data.password,
                }, { where: { id: data.id } })
            resolve(user)
        } catch (error) {
            reject(error) 
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({ where: { id: id } })
            resolve("Delete user successfully")
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    createNewUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
};

