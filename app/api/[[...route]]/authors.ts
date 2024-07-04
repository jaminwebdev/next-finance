import { Hono } from 'hono';

const app = new Hono()

app.get('/', (c) => c.json({ authors: 'blah' }))
app.post('/', (c) => c.json({ authors: 'blah created' }, 201))

export default app
