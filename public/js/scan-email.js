"use strict";
/* eslint-disable no-unused-vars */

/* global libpolycrypt */
/* global sendPing */

const sha1 = async(message) => {
  message = message.toLowerCase();
  const msgBuffer = new TextEncoder("utf-8").encode(message);
  let hashBuffer;
  if (/edge/i.test(navigator.userAgent)) {
    hashBuffer = libpolycrypt.sha1(msgBuffer);
  } else {
    hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  }
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
  return hashHex.toUpperCase();
};

const hashEmailAndSend = async(emailFormSubmitEvent) => {
  const emailForm = emailFormSubmitEvent.target;
  const emailInput = document.getElementById("scan-email");

  // show loader and hash email
  emailForm.classList.add("loading-data");
  emailForm.querySelector("input[name=emailHash]").value = await sha1(emailInput.value);

  // set unhashed email in client's sessionStorage and send key to server
  // so we can pluck these out later in scan-results and not lose them on back clicks
  sessionStorage.setItem(`scanned_${(sessionStorage.length + 1)}`, emailInput.value);
  emailForm.querySelector("input[name=scannedEmailId").value = sessionStorage.length;

  // clear input, send ping, and submit
  emailInput.value = "";
  sendPing(emailForm, "Success");
  emailForm.submit();
};