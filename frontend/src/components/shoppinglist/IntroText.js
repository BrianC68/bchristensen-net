import React from 'react';

const IntroText = () => {
  return (
    <div>
      <h2>Shopping List Frontend and API</h2>
      <p className="flow-text">
        This is a shopping list web app using React, Redux and Axios on the
        frontend and Django REST Framework for the backend API.  Give it a try,
          register your own username or login with username <span className="amber-text text-darken-4">guest</span> and password <span className="amber-text text-darken-4">SecretPassword</span>.
      </p>
    </div>
  )
}

export default IntroText;
