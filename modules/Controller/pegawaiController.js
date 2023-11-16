const httpStatus = require('http-status')
const Response = require('../Model/Response')

const bcrypt = require('../Utils/bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getPegawai = async (req, res) => {
    try {
        const pegawai = await prisma.pegawai.findMany()
        const response = new Response.Success(false, 'Results found', pegawai)
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}

const getPegawaiById = async (req, res) => {
    try {
        const response = await prisma.pegawai.findUnique({
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

const getPegawaiByAkunID = async (req, res) => {
    try {
        const pegawaiId = await prisma.pegawai.findFirst({
            where: {
                id_akun: Number(req.params.id)
            }
        })
        if (pegawaiId) {
            const response = new Response.Success(false, 'Results found', pegawaiId)
            res.status(httpStatus.OK).json(response)
        } else {
            const response = new Response.Error(true, 'Pegawai not found')
            res.status(httpStatus.NOT_FOUND).json(response)
        }
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}
 
const createPegawaiGroup = async (req, res) => {
    const {
        nama,
        no_identitas,
        no_telp,
        email,
        alamat,
        nama_institusi,
    } = req.body

    try {

        const existingUser = await prisma.pegawai.findFirst({
            where: {
                OR: [{ nama: nama }]
            }
        })

        if (existingUser) {
            const response = new Response.Error(true, 'Username already exists')
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        
        const pegawai = await prisma.pegawai.create({
            data: {
                nama,
                no_identitas,
                no_telp,
                email,
                alamat,
                nama_institusi,
                id_akun: 4,
            }
        })

        const response = new Response.Success(
            false,
            'Data inserted successfully',
            pegawai
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}



const createPegawai = async (req, res) => {
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
        const pegawai = await prisma.pegawai.create({
            data: {
                nama,
                no_identitas,
                no_telp,
                email,
                alamat,
                nama_institusi: '',
                id_akun: lastInsertedId
            }
        })

        const response = new Response.Success(
            false,
            'Data inserted successfully',
            pegawai
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}


const updatePegawai = async (req, res) => {
    const { nama, no_identitas, no_telp, email, alamat } = req.body
    // const { error, value } = pegawaiValidator.validate(req.body)

    // if (error) {
    //     return res.status(400).json({ msg: error.details[0].message })
    // }
    try {
        const pegawai = await prisma.pegawai.update({
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
            pegawai
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}

const deletePegawai = async (req, res) => {
    try {
        const pegawai = await prisma.pegawai.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        const response = new Response.Success(
            false,
            'Data deleted successfully',
            pegawai
        )
        res.status(httpStatus.OK).json(response)
    } catch (error) {
        const response = new Response.Error(true, error.message)
        res.status(httpStatus.BAD_REQUEST).json(response)
    }
}



module.exports = {
    createPegawai,
    getPegawai,
    getPegawaiById,
    deletePegawai,
    updatePegawai,
    getPegawaiByAkunID,
    createPegawaiGroup
}
