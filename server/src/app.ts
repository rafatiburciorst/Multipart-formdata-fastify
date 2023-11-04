import fastify from "fastify"
import { pipeline } from 'node:stream/promises'
import { createWriteStream, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import fastifyMultpart from '@fastify/multipart'
import fastifyCors from '@fastify/cors'
import { z } from 'zod'
const app = fastify()

app.register(fastifyCors, {
    methods: ['POST', 'GET']
})
app.register(fastifyMultpart, {
    limits: {
        fileSize: 100000000
    },
    throwFileSizeLimit: true,
})


app.post('/form', async (request, reply) => {

    const parts = request.parts()

    let data

    for await (const part of parts) {
        mkdirSync(join(__dirname, '..', 'upload'), { recursive: true })
        if (part.type === 'file') {
            await pipeline(
                part.file,
                createWriteStream(join(__dirname, '..', 'upload', part.filename))
            )
        } else {
            data = part.fields
        }
    }

    const schema = z.object({
        name: z.object({ value: z.string().min(1) }),
        description: z.object({ value: z.string().min(1) }),
    })


    const valid = await schema.safeParseAsync(data)

    if (!valid.success) {
        return reply.status(400).send({
            message: valid.error.formErrors.fieldErrors
        })
    }

    const { name, description } = valid.data

    console.log(
        name,
        description
    )

    return reply.status(200).send({
        message: 'saved in db'
    })
})

app.listen({
    host: '0.0.0.0',
    port: 3000
}).then(() => console.log('app running'))

