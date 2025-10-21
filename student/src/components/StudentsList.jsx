import React, { useState } from 'react'
import { useStudents, useCreateStudent, useDeleteStudent } from '../hooks/useStudents'


export default function StudentsList() {
    const { data: students, isLoading } = useStudents()
    const create = useCreateStudent()
    const del = useDeleteStudent()
    const [name, setName] = useState('')


    if (isLoading) return <div>Loading...</div>


    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); create.mutate({ firstName: name, lastName: '', email: `${name}@example.com` }); setName('') }}>
                <input value={name} onChange={e => setName(e.target.value)} className="border p-2 mr-2" placeholder="First name" />
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
            </form>


            <ul className="mt-4 space-y-2">
                {students?.map((s) => (
                    <li key={s.id} className="p-3 border rounded flex justify-between">
                        <div>
                            <div className="font-medium">{s.firstName} {s.lastName}</div>
                            <div className="text-sm text-gray-600">{s.email}</div>
                        </div>
                        <div>
                            <button onClick={() => del.mutate(s.id)} className="text-red-600">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}