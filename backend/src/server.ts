import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { serve } from '@hono/node-server'

const prisma = new PrismaClient()
const app = new Hono()

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (c.req.method === 'OPTIONS') {
    return c.text('OK')
  }
  await next()
})

// Base route
app.get('/', (c) => c.text('Student Management API'))

// CRUD routes
app.get('/students', async (c) => {
  const students = await prisma.student.findMany({ orderBy: { id: 'asc' } })
  return c.json(students)
})

app.get('/students/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) return c.json({ error: 'Not found' }, 404)
  return c.json(student)
})

app.post('/students', async (c) => {
  const body = await c.req.json()
  const student = await prisma.student.create({ data: body })
  return c.json(student, 201)
})

app.put('/students/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const student = await prisma.student.update({ where: { id }, data: body })
  return c.json(student)
})

app.delete('/students/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await prisma.student.delete({ where: { id } })
  return c.json({ ok: true })
})

serve({
  fetch: app.fetch,
  port: 3001,
})

console.log('🚀 Server running on http://localhost:3001')
