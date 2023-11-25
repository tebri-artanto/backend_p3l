const httpStatus = require("http-status");
const Response = require("../Model/Response");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getInvoicePelunasan = async (req, res) => {
  try {
    const invoice = await prisma.invoicePelunasan.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        reservasi: {
          include: {
            customer: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: invoice,
    });
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getInvoiceByReservasiId = async (req, res) => {
  try {
    const invoice = await prisma.invoicePelunasan.findFirst({
      where: { id_reservasi: Number(req.params.id) },
      include: {
        reservasi: {
          include: {
            customer: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: invoice,
    });
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};



const createInvoicePelunasanPesonal = async (req, res) => {
  const {
    front_office,
    total_tax,
    total_harga,
    total_jaminan,
    total_deposit,
    total_pelunasan,
    id_reservasi,
  } = req.body;
  try {
    let transactionId = generateTransactionId();
    let existingInvoice = await prisma.invoicePelunasan.findFirst({
      where: {
        no_invoice: transactionId,
      },
    });
    while (existingInvoice) {
      transactionId = generateTransactionId();
      existingInvoice = await prisma.invoicePelunasan.findFirst({
        where: {
          no_invoice: transactionId,
        },
      });
    }

    const invoice = await prisma.invoicePelunasan.create({
      data: {
        no_invoice: transactionId,
        tgl_invoice: new Date(),
        front_office: front_office,
        total_tax,
        total_harga,
        total_jaminan,
        total_deposit,
        total_pelunasan,
        id_reservasi,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const createInvoicePelunasanGroup = async (req, res) => {
  const {
    front_office,
    total_tax,
    total_harga,
    total_jaminan,
    total_deposit,
    total_pelunasan,
    id_reservasi,
  } = req.body;
  try {
    let transactionId = generateTransactionIdGroup();
    let existingInvoice = await prisma.invoicePelunasan.findFirst({
      where: {
        no_invoice: transactionId,
      },
    });
    while (existingInvoice) {
      transactionId = generateTransactionIdGroup();
      existingInvoice = await prisma.invoicePelunasan.findFirst({
        where: {
          no_invoice: transactionId,
        },
      });
    }

    const invoice = await prisma.invoicePelunasan.create({
      data: {
        no_invoice: transactionId,
        tgl_invoice: new Date(),
        front_office: front_office,
        total_tax,
        total_harga,
        total_jaminan,
        total_deposit,
        total_pelunasan,
        id_reservasi,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};



const generateTransactionId = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substr(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `P${day}${month}${year}-${random}`;
};

const generateTransactionIdGroup = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substr(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `G${day}${month}${year}-${random}`;
};

module.exports = {
  getInvoicePelunasan,
  createInvoicePelunasanPesonal,
  createInvoicePelunasanGroup,
  getInvoiceByReservasiId,
};