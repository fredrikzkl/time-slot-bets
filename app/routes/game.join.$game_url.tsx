import useUserId from "../hooks/useUserId";
import { Form, json, redirect, useLoaderData, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { TSBGame , JoinGameRequest} from "../types";
import { JoinGame, GetGameId } from "../services.server/GameService";
import ErrorBanner from "../components/ErrorBanner";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const { data, error } = await GetGameId(params.game_url);
  if (error)
    return json(error.message, { status: 500 });
  if (!data) {
    return json("Game not found", { status: 404 });
  }
  return json(data.id);
}

export async function action({ request, params }: ActionFunctionArgs) {
  let formData = await request.formData();
  const errors: {
    insertError?: string
    name?: string
    minute?: string
    second?: string
  } = {};

  const name = String(formData.get('name'));
  const minute = Number(formData.get('minute'));
  let second = Number(formData.get('second'));

  if (!name || name.length < 2) {
    errors.name = 'Name is required';
  }

  if (name.length > 30) {
    errors.name = 'Name must be less than 30 characters';
  }

  if (!minute) {
    errors.minute = 'Minute is required';
  }

  if (minute > 999)
    errors.minute = 'Minute must be less than 4 digits';

  if (!second) {
    second = 0;
  }

  if (second > 59)
    errors.second = 'Second must be less than 60';


  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const req  : JoinGameRequest = {
    game_id: String(formData.get('game_id')),
    user_id: String(formData.get('user_id')),
    name : name,
    minutes : minute,
    seconds : second
  }

  const insertError = await JoinGame(req);

  if (insertError) {
    errors.insertError = "Something went wrong 🥹";
    return json({ errors });
  }

  return redirect("/game/" + params.game_url);
}

export default function GameJoin() {
  let gameId = useLoaderData<typeof loader>() as TSBGame;
  const actionData = useActionData<typeof action>();

  const userId = useUserId();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <Form className="overflow-x-auto" method="post">

        {actionData?.errors.insertError && (
          <ErrorBanner error={actionData?.errors.insertError} />
        )}

        <input type="hidden" name="game_id" value={gameId} />
        <input type="hidden" name="user_id" value={userId} />

        <label className='form-control w-full max-w-xs mb-6'>
          <div className="label">
            <span className="label-text">What is your name?</span>
          </div>
          <input
            className={`input input-bordered w-full max-w-xs ${actionData?.errors?.name ? 'input-error' : ''}`}
            type='text'
            name='name'
            placeholder="Name"
            maxLength={30}
          />
          {actionData?.errors?.name ? (
            <em>{actionData?.errors.name}</em>
          ) : null}
        </label>

        <label className='form-control w-full max-w-xs'>
          <div className="label">
            <span className="label-text">Time bet</span>
          </div>
          <div className="grid grid-cols-2 max-w-xs gap-2">
            <input
              className={`input input-bordered w-full ${actionData?.errors?.minute ? 'input-error' : ''}`}
              type="number"
              name='minute'
              placeholder="Minute"
            />
            <input
              className={`input input-bordered w-full ${actionData?.errors?.second ? 'input-error' : ''}`}
              type="number"
              name='second'
              placeholder="Second"
            />
          </div>
          {actionData?.errors?.minute ? (
            <em>{actionData?.errors.minute}</em>
          ) : null}
          {actionData?.errors?.second ? (
            <em>{actionData?.errors.second}</em>
          ) : null}
        </label>

        <div className='form-contro w-full max-w-xsl mt-12'>
          <button
            className="btn btn-primary w-full"
            aria-label="join"
            name="_action"
            type="submit"
          >
            Join
          </button>
        </div>
      </Form>
    </div>
  )
} 