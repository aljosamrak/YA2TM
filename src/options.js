// Saves options to localStorage.
function save_options() {
  var daysLookback = document.getElementById("daysLookback").value;
  console.log(daysLookback);
  localStorage["days_lookback"] = daysLookback;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function () {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var daysLookback = localStorage["days_lookback"];
  console.log(daysLookback);
  if (!daysLookback) {
    daysLookback = 7;
  }
  document.getElementById("daysLookback").value = daysLookback;
}


document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById('save').addEventListener('click', save_options);
});