$(document).ready(function() 
{
    // Load saved cards on page load
    loadCardsFromLocalStorage();
    let deleteAllCards = document.getElementById("deleteAllCards");

    deleteAllCards.addEventListener("submit", (e) => {
      e.preventDefault();
      // Remove all cards from the UI
      console.log("heyy");
      $("#cardList").empty();
      // Clear all card data from local storage
      localStorage.removeItem('cards');
    
    });
    let addCardForm = document.getElementById("addCardForm");
    addCardForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Getting Data
      var title = document.getElementById("title").value;
      var description = document.getElementById("description").value;
      var date = document.getElementById("date").value;
      var time = document.getElementById("time").value;
      var event = document.getElementById("event").value;
      var place = document.getElementById("place").value;
      var image = $("#image").prop('files')[0]; // Get the image file

      // Convert image to Base64
      var imageUrl= await getImageAsBase64(image);

      // Create a unique ID for each card
      var cardId = Date.now().toString(); // Example of generating a unique ID

      // Create a card object
      var card = {
      id: cardId,
      title: title,
      description: description,
      date: date,
      time: time,
      event: event,
      place: place,
      imageUrl: imageUrl
      };
      
      // Save the card to local storage
      saveCardToLocalStorage(card);

      console.log(title);
      console.log(description);
      console.log(date);
      console.log(time);
      console.log(event);
      console.log(place);

      // Clear input fields
      document.getElementById("title").value = '';
      document.getElementById("description").value = '';
      document.getElementById("date").value = '';
      document.getElementById("time").value = '';
      document.getElementById("event").value = '';
      document.getElementById("place").value = '';
      document.getElementById("image").value = '';

      // Add the card to the list
      addCardToUI(card);

    });

  // Delete card
  $("#cardList").on("click", ".delete-card", function() {
    var cardId = $(this).closest('.col-md-3').data('id');
    // Remove the card from local storage
    removeCardFromLocalStorage(cardId);
    // Remove the card from UI
    $(this).closest('.col-md-3').remove();
  });
  
  function saveCardToLocalStorage(card) {
    // Retrieve existing cards from local storage
    var cards = JSON.parse(localStorage.getItem('cards')) || [];
    // Add the new card
    cards.push(card);
    // Save the updated cards to local storage
    localStorage.setItem('cards', JSON.stringify(cards));
  }

  function loadCardsFromLocalStorage() {
    // Retrieve cards from local storage
    var cards = JSON.parse(localStorage.getItem('cards')) || [];
    
    // Add each card to the UI
    cards.forEach(function(card) {
      addCardToUI(card);
    });
  }
  
  function removeCardFromLocalStorage(cardId) {
    // Retrieve existing cards from local storage
    var cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards = cards.filter(function(card) {
      return card.id != cardId;
    });
    // Save the updated cards to local storage
    localStorage.setItem('cards', JSON.stringify(cards));
  }

  function addCardToUI(card) {
    cardHtml = `<div class="col-md-3 col-sm-5" data-id="${card.id}">
    <div class="card" >
        <img class="card-img-top" src="${card.imageUrl}" alt="Card image" >
        <div class="card-body">
            <h4 class="card-title"><b>${card.title}</b></h4>
            <span><p><b>Date:</b> ${card.date}</p></span>
            <span><p><b>Time:</b> ${card.time}</p></span>
            <span><p><b>Event:</b> ${card.event}</p></span>
            <span><p><b>Location:</b> ${card.place}</p></span>
            <p class="card-text heading"> <b>Desciption:</b>${card.description}</p>
            <div class="buttons">
            <button class="btn btn-warning edit-card" data-id="${card.id}" data-target="#editCardModal" data-toggle="modal" >Edit Card</button>
            <button class="btn btn-danger delete-card">Delete Card</button>
            </div>
        </div>
    </div>
    </div>`;
    
    $("#cardList").append(cardHtml);
  }

  function getImageAsBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      
      reader.onload = function() {
        resolve(reader.result);
      };
      
      reader.onerror = function(error) {
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Event listener for edit card buttons
  $("#cardList").on("click", ".edit-card", function() {
    // Get the card ID from the data-id attribute
    var cardId = $(this).closest('.btn').data('id');
    // Retrieve the card details using the card ID and populate the modal
    var card = getCardById(cardId);
    populateModal(card);
  });

  // Function to retrieve card details by ID
  function getCardById(cardId) {
      // Assuming you have a list of cards stored in local storage
      var cards = JSON.parse(localStorage.getItem('cards')) || [];
      // Find the card with the specified ID
      for (var i = 0; i < cards.length; i++) {
          if (cards[i].id == cardId) {
              return cards[i];
          }
      }
      return null; // Return null if card with the specified ID is not found
  }

  // Function to populate the modal with card details
  function populateModal(card) {
      // Populate modal form fields with card details
      $("#changetitle").val(card.title);
      $("#changedescription").val(card.description);
      $("#changedate").val(card.date);
      $("#changetime").val(card.time);
      $("#changeevent").val(card.event);
      $("#changeplace").val(card.place);
      $("#cardid").val(card.id);
      // Assuming you have an image element in the modal
      $("#changeimage").attr("src", card.imageUrl); // Update the image source

      // Show the modal
      $('#editCardModal').modal('show');
  }

  // Event listener for submitting the edit card form
  $("#editCardModal").submit(async function(event) {
      event.preventDefault(); // Prevent default form submission

      // Retrieve the updated values from form fields
      var updatedTitle = $("#changetitle").val();
      var updatedDescription = $("#changedescription").val();
      var updatedDate = $("#changedate").val();
      var updatedTime = $("#changetime").val();
      var updatedEvent = $("#changeevent").val();
      var updatedPlace = $("#changeplace").val();
      var cardId = $("#cardid").val(); // Retrieve card ID from hidden input field

      // Retrieve the card from local storage
      var cards = JSON.parse(localStorage.getItem('cards')) || [];
      var cardIndex = cards.findIndex(function(card) {
          return card.id == cardId;
      });
      if (cardIndex !== -1) {
          // Update the card with the new values
          cards[cardIndex].title = updatedTitle;
          cards[cardIndex].description = updatedDescription;
          cards[cardIndex].date = updatedDate;
          cards[cardIndex].time = updatedTime;
          cards[cardIndex].event = updatedEvent;
          cards[cardIndex].place = updatedPlace;
          // Update the card in local storage
          localStorage.setItem('cards', JSON.stringify(cards));
          // Update the card's UI representation if necessary
          $("#cardList").empty();
          loadCardsFromLocalStorage();
      } else {
          console.error('Card not found.');
      }
  });

});
    
  
// $(document).ready(function() 
// {
//     $("#addCardForm").submit(function(event) {
//       event.preventDefault();
      
//       var title = $("#title").val();
//       var description = $("#description").val();
//       var date = $("#date").val();
//       var time = $("#time").val();
//       var event = $("#event").val();
//       var place = $("#place").val();
      
//       // Clear input fields
//     //   $("#title").val('');
//     //   $("#description").val('');
//     //   $("#date").val('');
//     //   $("#time").val('');
//     //   $("#event").val('');
//     //   $("#place").val('');
      
//       var card = `
//         <div class="card">
//           <div class="card-body">
//             <h5 class="card-title">${title}</h5>
//             <p class="card-text">${description}</p>
//             <p>Date: ${date}</p>
//             <p>Time: ${time}</p>
//             <p>Event: ${event}</p>
//             <p>Nearest Place: ${place}</p>
//             <button class="btn btn-danger delete-card">Delete</button>
//           </div>
//         </div>
//       `;
      
//       $("#cardList").append(card);
//     });
    
//     // Delete card
//     $("#cardList").on("click", ".delete-card", function() {
//       $(this).closest('.card').remove();
//     });
//   });