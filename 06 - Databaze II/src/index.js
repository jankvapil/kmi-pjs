const { PrismaClient } = require("@prisma/client")

const main = async () => {
  try {
    const prisma = new PrismaClient()
    const newLog = await prisma.log.create({
      data: {
        text: "first log"
      }
    })
    console.log(newLog)
  } catch (err) {
    console.error(err)
  }
}
main()