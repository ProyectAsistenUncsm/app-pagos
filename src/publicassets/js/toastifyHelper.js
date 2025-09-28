function showToast(message, type = 'success') {
    const backgroundColor = type === 'error' ? "#f44336" : "#4CAF50";
  
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor,
      stopOnFocus: true
    }).showToast();
  }