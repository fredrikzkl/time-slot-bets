import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, redirect, useNavigation } from "@remix-run/react";

import { v4 as uuidv4 } from 'uuid';

import useUserId from "../hooks/useUserId.js";

import db from "../utils/db.js";

export const meta: MetaFunction = () => {
  return [
    { title: "Time slot bets" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  const gameURL = uuidv4().slice(0, 8);

  const {error} = await db.from('game').insert({
    host_id: values.user_id,
    game_url: gameURL,
    game_name: values.game_name
  })

  if (error) {
    return json({error}, {status: 500});
  }

  return redirect(`/game/${gameURL}`);
}


export default function Index() {
  const userId = useUserId();
  
  const navigation = useNavigation();

  const isSubmitting = navigation.formAction === "/?index";

  function openModal() {
    let m = document.getElementById('new-game-modal') as HTMLDialogElement;
    if (m)
      m.showModal();
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Time slot bets ⚽️</h1>
          <p className="py-6">
            just some bets with the boys 🍺
          </p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            New game 🤝
          </button>
        </div>
      </div>

      <dialog id="new-game-modal" className="modal">
        <div className="modal-box">
          <h2 className="font-bold text-lg">New bet</h2>
          <Form method='post' className="inline-block space-y-4 mt-6 ">
            <input type="hidden" name="user_id" value={userId} />
            <input
              name="game_name"
              type="text"
              placeholder="Game Name"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <button
              className="btn btn-primary"
              aria-label="join"
              name="_action"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Create
            </button>
          </Form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button disabled={isSubmitting} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>

  );
}

