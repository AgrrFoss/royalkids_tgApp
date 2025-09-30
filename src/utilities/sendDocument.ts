// import type { Config } from 'src/payload-types'
//
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
//
// type Collection = keyof Config['collections']
//
// export async function sendDocument(collection: Collection, data: any) {
//   const payload = await getPayload({ config: configPromise })
//
//   const sendFunction = await payload.create({
//     collection,
//     data,
//   })
//
//   return sendFunction
// }

const sendDocument = async (endpoint: string, body: any) => {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  })
}

export default sendDocument