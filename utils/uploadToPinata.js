const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

require("dotenv").config()

const pinataKey = process.env.PINATA_API_KEY
const pinataSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataKey, pinataSecret)

const storeImages = async (imagesPath) => {
      const fullImagesPath = path.resolve(imagesPath)
      const files = fs.readdirSync(fullImagesPath)

      console.log("Uploding to IPFS")
      let responses = []
      for (fileIndex in files) {
            console.log(`Working on ${files[fileIndex]}`)
            const readableStreamForFile = fs.createReadStream(
                  `${fullImagesPath}/${files[fileIndex]}`
            )
            const options = {
                  pinataMetadata: {
                        name: files[fileIndex],
                  },
            }
            try {
                  await pinata
                        .pinFileToIPFS(readableStreamForFile, options)
                        .then((result) => {
                              responses.push(result)
                        })
                        .catch((err) => {
                              console.log(err)
                        })
            } catch (err) {
                  console.log(err)
            }
      }
      return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
      const options = {
            pinataMetadata: {
                  name: metadata.name,
            },
      }
      try {
            const response = await pinata.pinJSONToIPFS(metadata, options)
            return response
      } catch (error) {
            console.log(error)
      }
      return null
}

module.exports = { storeImages, storeTokenUriMetadata }
