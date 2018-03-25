import React, { Component } from "react";
import netlifyIdentity from "netlify-identity-widget";

function getQueryStringValue(key) {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
}
getQueryStringValue("code");

console.log(fetch);

export class OAuth extends Component {
  componentDidMount() {
    fetch(
      `https://sad-mccarthy.netlify.com/.netlify/functions/graphql?code=${getQueryStringValue(
        "code"
      )}`,
      {
        headers: {
          authorization: `Bearer ${
            netlifyIdentity.currentUser().token.access_token
          }`
        }
      }
    );
    console.log("1");
  }

  render() {
    return null;
  }
}
