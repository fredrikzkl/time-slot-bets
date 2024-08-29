import { Gambler } from '../types'; // Assuming the 'Gambler' type is defined in a separate file called 'types.ts'

export default function GamblerTable({ gamblers, userId }: { gamblers: Gambler[], userId? :string }) {
    console.log(gamblers);
    if (!gamblers || !gamblers.length) {
        return <p className='p-8'>No gamblers yet</p>
    }
    return (
        <div className="overflow-x-auto mt-8 mb-12   max-w-lg mx-auto">
            <table className="table text-center ">
                {/* head */}
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                {gamblers.map((gambler) => (
                    <tr key={gambler.user_id} className={`${userId == gambler.user_id && 'bg-base-200'}`}>
                        <td>{gambler.name}</td>
                        <td>???</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}