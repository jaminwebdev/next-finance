import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import authors from './authors'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.route('/authors', authors)

export const GET = handle(app)
export const POST = handle(app)


// app
// .get('/test', (c) => {
//     return c.json({
//         message: 'Test route'
//     })
// })
// .get('/test/:id',
//     zValidator("param", z.object({
//         id: z.string({message: 'Please pass a string, not a number'}),
//     })),
//     (c) => {
//     const { id } = c.req.valid("param")

//     return c.json({
//         id: `Here's your ${id}`
//     })
// })
// .post('/create/:postId', 
//     zValidator("json", z.object({
//         name: z.string(),
//         userId: z.number()
//     })),
//     zValidator("param", z.object({
//         postId: z.number()
//     })), (c) => {
//         const { name, userId } = c.req.valid("json")
//         const { postId } = c.req.valid("param")
        
//         return c.json({
//             name,
//             userId,
//             postId
//         })
// }) 