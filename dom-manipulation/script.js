const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "The best way to predict the future is to create it.", category: "Action" }
];
function displayRandomQuote() {
    // Get the HTML element where the quote will be displayed.
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Check if there are any quotes in the array.
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add some!";
        return; // Exit the function if no quotes exist.
    }

    // Generate a random index within the bounds of the quotes array.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Retrieve the quote object at the random index.
    const randomQuote = quotes[randomIndex];

    // Update the text content of the quoteDisplay div with the selected quote and its category.
    quoteDisplay.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

function createAddQuoteForm() {
    // Get the container element where the form will be added.
    const formContainer = document.getElementById('addQuoteFormContainer');

    // Create a new div element to group the form inputs and button.
    const formDiv = document.createElement('div');
    formDiv.id = 'quoteAdditionForm'; // Assign an ID for potential future styling or targeting.

    // Create the input field for the new quote's text.
    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText'; // Assign ID
    quoteTextInput.type = 'text'; // Set input type
    quoteTextInput.placeholder = 'Enter a new quote'; // Set placeholder text

    // Create the input field for the new quote's category.
    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.id = 'newQuoteCategory'; // Assign ID
    quoteCategoryInput.type = 'text'; // Set input type
    quoteCategoryInput.placeholder = 'Enter quote category'; // Set placeholder text

    // Create the "Add Quote" button.
    const addQuoteButton = document.createElement('button');
    addQuoteButton.textContent = 'Add Quote'; // Set button text
    // Attach the 'addQuote' function to the button's onclick event.
    // This allows the function to be called when the button is clicked.
    addQuoteButton.onclick = addQuote;

    // Append all the created elements to the formDiv.
    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(quoteCategoryInput);
    formDiv.appendChild(addQuoteButton);

    // Append the entire formDiv to its container in the HTML, making it visible on the page.
    formContainer.appendChild(formDiv);
}

function addQuote() {
    // Get the values entered by the user in the dynamically created input fields.
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Basic validation: Check if both input fields are not empty.
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category."); // Alert the user if input is missing.
        return; // Stop the function execution.
    }

    // Create a new quote object from the user's input.
    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    // Add the newly created quote object to the 'quotes' array.
    quotes.push(newQuote);

    
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    displayRandomQuote();

    // Provide an additional alert to confirm the quote was successfully added.
    alert("Quote added successfully!");
}


document.addEventListener('DOMContentLoaded', function() {
    // Display an initial random quote when the page first loads.
    
    displayRandomQuote();

    // Dynamically create and add the form for adding new quotes.
    createAddQuoteForm();

    // Get a reference to the "Show New Quote" button.
    const newQuoteButton = document.getElementById('newQuote');
    // Attach a click event listener to the button. When clicked,
    
    newQuoteButton.addEventListener('click', displayRandomQuote);
});
