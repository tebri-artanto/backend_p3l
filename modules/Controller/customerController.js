const httpStatus = require('http-status')
const Response = require('../Model/Response')
const customerValidator = require('../Utils/customerValidator')
const userValidator = require('../Utils/UserValidator')
const bcrypt = require('../Utils/bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getCustomer = async (req, res) => {
    try {
        const customer = await prisma.customer.findMany()
        const response = new Response.Success(false, 'Results found', customer)
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}

const getCustomerById = async (req, res) => {
    try {
        const response = await prisma.customer.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        res.status(200).json({
            status: 'success',
            message: 'Data fetched successfully',
            data: response
        })
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}

const getCustomerByAkunID = async (req, res) => {
    try {
        const customerId = await prisma.customer.findFirst({
            where: {
                id_akun: Number(req.params.id)
            }
        })
        if (customerId) {
            const response = new Response.Success(false, 'Results found', customerId)
            res.status(httpStatus.OK).json(response)
        } else {
            const response = new Response.Error(true, 'Customer not found')
            res.status(httpStatus.NOT_FOUND).json(response)
        }
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}
 
const createCustomerGroup = async (req, res) => {
    const {
        nama,
        no_identitas,
        no_telp,
        email,
        alamat,
        nama_institusi,
    } = req.body

    try {

        const existingUser = await prisma.customer.findFirst({
            where: {
                OR: [{ nama: nama }]
            }
        })

        if (existingUser) {
            const response = new Response.Error(true, 'Username already exists')
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        
        const customer = await prisma.customer.create({
            data: {
                nama,
                no_identitas,
                no_telp,
                email,
                alamat,
                nama_institusi,
                id_akun: 4,
                create_at: new Date(),
            }
        })

        const response = new Response.Success(
            false,
            'Data inserted successfully',
            customer
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}



const createCustomer = async (req, res) => {
    const {
        username,
        password,
        nama,
        no_identitas,
        no_telp,
        email,
        alamat,
    } = req.body

    try {
        // const { error, value } = userValidator.validate(req.body)
        // if (error) {
        //     return res.status(400).json({ msg: error.details[0].message })
        // }
        const existingUser = await prisma.akun.findFirst({
            where: {
                OR: [{ username: username }]
            }
        })

        if (existingUser) {
            const response = new Response.Error(true, 'Username already exists')
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.akun.create({
            data: {
                username,
                password: hashedPassword,
                id_role: 1,
            }
        })
        const lastInsertedId = user.id
        const customer = await prisma.customer.create({
            data: {
                nama,
                no_identitas,
                no_telp,
                email,
                alamat,
                nama_institusi: '',
                id_akun: lastInsertedId,
                create_at: new Date(),
            }
        })

        const response = new Response.Success(
            false,
            'Data inserted successfully',
            customer
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}


const updateCustomer = async (req, res) => {
    const { nama, no_identitas, no_telp, email, alamat } = req.body
    // const { error, value } = customerValidator.validate(req.body)

    // if (error) {
    //     return res.status(400).json({ msg: error.details[0].message })
    // }
    try {
        const customer = await prisma.customer.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                nama,
                no_identitas,
                no_telp,
                email,
                alamat,
            }
        })

        const response = new Response.Success(
            false,
            'Data edited successfully',
            customer
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const customer = await prisma.customer.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        const response = new Response.Success(
            false,
            'Data deleted successfully',
            customer
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}




module.exports = {
    createCustomer,
    getCustomer,
    getCustomerById,
    deleteCustomer,
    updateCustomer,
    getCustomerByAkunID,
    createCustomerGroup,
}
