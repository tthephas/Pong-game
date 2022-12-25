console.log('its working')

/// Make a pop up function for the instructions. When a user hits the button, a pop up comes up and tells the user how to play

const popUpInstructions = () => {
    document.getElementById("myInstructions").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myInstructions").style.display = "none";
  }