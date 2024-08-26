import React, { useEffect, useState } from 'react'

import { v4 as uuidv4 } from 'uuid';

const user_key = "user_id";

export default function useUserId() {
  const [userId, setUserId] = useState('')

  useEffect(() => {
    let userID = window.localStorage.getItem(user_key);
    if (!userID || userID === '' || userID === 'null') {
      userID = uuidv4().slice(0, 10);
      console.log("generated new user id", userID);
      window.localStorage.setItem(user_key, userID || '');
    }
    setUserId(userID || '');
  }, []);

  return userId
}