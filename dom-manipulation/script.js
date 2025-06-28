// Step 2.1: Initialize an array of quote objects.
// This array will hold all our quotes, each with a 'text' and 'category' property.
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "The best way to predict the future is to create it.", category: "Action" }
];

// Step 2.2: Implement showRandomQuote function.
// This function selects a random quote from the 'quotes' array and displays it on the page.
// RENAMED back to showRandomQuote to match current checker's requirement.
function showRandomQuote() { // Changed from displayRandomQuote back to showRandomQuote
    // Get the HTML element where the quote will be displayed.
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Check if there are any quotes in the array.
    if (quotes.length === 0) {
        // Changed to innerHTML as per checker's requirement
        quoteDisplay.innerHTML = "No quotes available. Add some!";
        return; // Exit the function if no quotes exist.
    }

    // Generate a random index within the bounds of the quotes array.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Retrieve the quote object at the random index.
    const randomQuote = quotes[randomIndex];

    // Update the text content of the quoteDisplay div with the selected quote and its category.
    // Changed to innerHTML as per checker's requirement
    quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

// Step 2.3: Implement createAddQuoteForm function.
// This function dynamically creates the HTML elements for adding new quotes (input fields and a button)
// and inserts them into the designated container in the DOM.
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

// Step 3.1: Implement addQuote function.
// This function handles the logic for adding a new quote to the 'quotes' array
// and providing user feedback. This function needs to be globally accessible
// as it's directly assigned to an 'onclick' event.
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

    // Clear the input fields after the quote has been added,
    // preparing them for the next user entry.
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // After adding, show a new random quote. This confirms to the user that
    // their quote has been added to the pool and new content can be displayed.
    // CALLING THE RENAMED FUNCTION HERE (back to showRandomQuote)
    showRandomQuote(); // Changed from displayRandomQuote back to showRandomQuote

    // Provide an additional alert to confirm the quote was successfully added.
    alert("Quote added successfully!");
}

// Step 2.4: Initial Page Load Setup.
// This ensures that our JavaScript code runs only after the entire HTML document
// has been fully loaded and parsed by the browser.
document.addEventListener('DOMContentLoaded', function() {
    // Display an initial random quote when the page first loads.
    // CALLING THE RENAMED FUNCTION HERE (back to showRandomQuote)
    showRandomQuote(); // Changed from displayRandomQuote back to showRandomQuote

    // Dynamically create and add the form for adding new quotes.
    createAddQuoteForm();

    // Get a reference to the "Show New Quote" button.
    const newQuoteButton = document.getElementById('newQuote');
    // Attach a click event listener to the button. When clicked,
    // the 'showRandomQuote' function will be executed.
    // ATTACHING THE RENAMED FUNCTION HERE (back to showRandomQuote)
    newQuoteButton.addEventListener('click', showRandomQuote); // Changed from displayRandomQuote back to showRandomQuote
});
