import { Gambler } from '../types'; // Assuming the 'Gambler' type is defined in a separate file called 'types.ts'

export default function GamblerTable({ gamblers }: { gamblers: Gambler[] }) {
    console.log(gamblers);
    if (!gamblers || !gamblers.length) {
        return <p className='p-8'>No gamblers yet</p>
    }
    return (
        <div className="overflow-x-auto mt-8 mb-8">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Time</th>
                    </tr>
                </thead>
                {
                    // body
                    gamblers.map((gambler) => (
                        <tr key={gambler.id}>
                            <td>{gambler.name}</td>
                            <td>{gambler.time}</td>
                        </tr>
                    ))
                }
            </table>
        </div>
    )
}