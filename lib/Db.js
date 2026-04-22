import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log(" Already connected")
      return
    }   

    await mongoose.connect(process.env.MONGO_URI)

    console.log(" MongoDB Connected Successfully")

  } catch (error) {
    console.log(" MongoDB Connection Error:", error)
  }
}