import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import {createSupabaseServerClient} from '../utils/supabase.server'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Index() {
  async function handleSubmit() {
    console.log('submit');
  }

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Time slot bets with the boys</h1>
      <Form
            // action="destroy"
            method="post"
            onSubmit={() => {handleSubmit()}}
          >
            <button className="btn btn-primary" type="submit">Ny time slot bet</button>
          </Form>
    </div>
  );
}
