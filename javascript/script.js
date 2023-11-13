function timeBasedGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    document.getElementById("time-based-greeting").innerText = "Buongiorno";
  } else if (hour < 18) {
    document.getElementById("time-based-greeting").innerText = "Buon pomeriggio";
  } else {
    document.getElementById("time-based-greeting").innerText = "Buonasera";
  }
}

timeBasedGreeting();

setInterval(timeBasedGreeting, 3600000);
