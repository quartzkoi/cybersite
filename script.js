function showPopup() {
    var contact = document.querySelector('input[name="contact"]:checked').value;

    switch (contact) {
      case '0':
        alert("Thank you! I will try to reach out to you in the morning (between 8:00am and 12:00)");
        break;
      case '1':
        alert("Thank you! I will try to reach out to you in the afternoon (between 12:00 and 4:00)");
        break;
      case '2':
        alert("Thank you! I will try to reach out to you in the evening (between 4:00 and 8:00pm)");
        break;
    }
  }
  function spinImage() {
    var image = document.getElementById('popupImage');
    image.classList.toggle('spin');
}
