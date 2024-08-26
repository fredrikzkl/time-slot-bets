import { Form, useActionData } from "@remix-run/react";

export default function NewGamblerForm({ gameId, userId }: {
    gameId: string,
    userId: string
}) {
    return (
        <Form className="overflow-x-auto" method="post">
            <input type="hidden" name="game_id" value={gameId} />
            <input type="hidden" name="user_id" value={userId} />

            <label className='form-control w-full max-w-xs mb-6'>
                <div className="label">
                    <span className="label-text">What is your name?</span>
                </div>
                <input 
                    className="input input-bordered w-full max-w-xs" 
                    type='text' 
                    name='name' 
                    placeholder="Name" 
                    required
                    pattern=".{7,}"
                />
                
            </label>

            <label className='form-control w-full max-w-xs mb-6'>
                <div className="label">
                    <span className="label-text">How much time do you bet?</span>
                </div>
                <div className="grid grid-cols-2 max-w-xs gap-2">
                    <input className="input input-bordered w-full" type="number" name='minute' placeholder="Minute" />
                    <input className="input input-bordered w-full" type="number" name='second' placeholder="Second" />
                </div>
            </label>

            <div className='form-contro w-full max-w-xsl'>
                <button
                    className="btn btn-primary"
                    aria-label="join"
                    name="_action"
                    type="submit"
                >
                    Join
                </button>
            </div>
        </Form>
    )
}