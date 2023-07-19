import { db } from '@/db'
import { users } from '@/db/schema'
import { revalidatePath } from 'next/cache'

export default async function Home() {
  const allUsers = await db.select().from(users)

  async function addUser(data: FormData) {
    'use server'

    const id = Math.floor(Math.random() * 1000 + 1)

    const fullName = data.get('full_name')?.toString()
    const phone = data.get('phone')?.toString()

    await db.insert(users).values({ id, fullName, phone })

    revalidatePath('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-zinc-50">
      <form action={addUser} className="flex flex-col gap-3">
        <input
          type="text"
          name="full_name"
          placeholder="Full name"
          className="text-zinc-900"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="text-zinc-900"
        />

        <button type="submit">Create</button>
      </form>

      <p>Lista de usuários</p>

      {allUsers.map((user) => (
        <div key={user.id} className="flex gap-3">
          <p>Nome: {user.fullName}</p>
          <p>Telefone: {user.phone}</p>
        </div>
      ))}
    </div>
  )
}
