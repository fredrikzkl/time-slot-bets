import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useOutletContext } from "@remix-run/react";

import {createSupabaseServerClient} from '../utils/supabase.server'

import type { OutletContext } from '~types'


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Index() {
  const { supabase } = useOutletContext<OutletContext>();

  async function handleSubmit() {

    // Create random game url
    let gameUrl = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    supabase.from('game').insert({host_id: 'hello_World'}).then(() => {
      console.log('inserted')
    });
  }

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Time slot bets with the boys</h1>
      <Form
            action="/"
            method="post"
            onSubmit={() => {handleSubmit()}}
          >
            <button className="btn btn-primary" type="submit">New game</button>
          </Form>
    </div>
  );
}
