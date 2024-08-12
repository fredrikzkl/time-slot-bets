import { Form } from "@remix-run/react";

export default function NewGamblerForm({ gameId, userId }: { 
    gameId: string, 
    userId: string
}) {
    return (
        <Form className="overflow-x-auto" method="post">
            <input type="hidden" name="game_id" value={gameId} />
            <input type="hidden" name="user_id"  value={userId} />
            <input className="input input-bordered w-full max-w-xs" type='text' name='name' placeholder="Name" />

            <button
                className="btn btn-primary"
                aria-label="join"
                name="_action"
                type="submit"
            >
                Join
            </button>
        </Form>
    )
}