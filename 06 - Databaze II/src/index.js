const { PrismaClient } = require("@prisma/client")

const main = async () => {
  try {
    const prisma = new PrismaClient()
    const newLog = await prisma.log.delete({
      where: { id: "6240ab1d753fa5383750718a"}
    })
    console.log(newLog)
  } catch (err) {
    console.error(err)
  }
}
main()