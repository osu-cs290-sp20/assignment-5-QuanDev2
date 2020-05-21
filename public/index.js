/*
 * Write your client-side JS code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name:
 * Email:
 */


/*
 * This function should use your Handlebars twit template to generate HTML
 * representing a single twit, given the twit text and author as arguments to
 * the function.  The generated HTML should then be inserted into the DOM at
 * the end of the <main> element whose class is "twit-container".
 *
 * The function currently uses native JS methods to generate a new DOM element
 * representing single twit, given the specified information, and inserts that
 * twit into the DOM.  The new post element has the following structure:
 *
 * <article class="twit">
 *   <div class="twit-icon">
 *     <i class="fa fa-bullhorn"></i>
 *   </div>
 *   <div class="twit-content">
 *     <p class="twit-text">
 *       <TWIT_TEXT>
 *     </p>
 *     <p class="twit-author">
 *       <a href="#"><TWIT_AUTHOR></a>
 *     </p>
 *   </div>
 * </article>
 */
function insertNewTwit(twitText, twitAuthor) {

  // Create a new twit <article> element.
  var twitElem = document.createElement('article');
  twitElem.classList.add('twit');

  /*
   * Create a new twit-icon <div> element, insert bullborn with innerHTML
   * (which is safe in this case because we're not dealing with user input),
   * and add the div into the new twit element.
   */
  var twitIconElem = document.createElement('div');
  twitIconElem.classList.add('twit-icon');
  twitIconElem.innerHTML = '<i class="fa fa-bullhorn"></i>';
  twitElem.appendChild(twitIconElem);

  /*
   * Create a new twit-content <div> element, and insert it into the new twit
   * element.
   */
  var twitContentElem = document.createElement('div');
  twitContentElem.classList.add('twit-content');
  twitElem.appendChild(twitContentElem);

  /*
   * Create a new twit-text <p> element and add to it a text node containing
   * the twit text value specified by the user.  Add the twit-text <p> element
   * into the twit-content element.
   */
  var twitTextNode = document.createTextNode(twitText);
  var twitTextElem = document.createElement('p');
  twitTextElem.classList.add('twit-text');
  twitTextElem.appendChild(twitTextNode);
  twitContentElem.appendChild(twitTextElem);

  /*
   * Create a new twit-author <p> element and add to it an <a> element
   * that itself contains a text node with the twit author value
   * specified by the user.  Add the twit-author <p> element into the
   * twit-content element.
   */
  var twitAuthorTextNode = document.createTextNode(twitAuthor);
  var twitAuthorLinkElem = document.createElement('a');
  twitAuthorLinkElem.href = '#';
  twitAuthorLinkElem.appendChild(twitAuthorTextNode);
  var twitAuthorElem = document.createElement('p');
  twitAuthorElem.classList.add('twit-author');
  twitAuthorElem.appendChild(twitAuthorLinkElem);
  twitContentElem.appendChild(twitAuthorElem);

  var twitContainer = document.querySelector('main.twit-container');
  twitContainer.appendChild(twitElem);

}


/***************************************************************************
 **
 ** You should not modify any of the code below.
 **
 ***************************************************************************/

/*
 * This is a global array containing an object representing each twit.  Each
 * twit object has the following form:
 *
 * {
 *   text: "...",
 *   author: "..."
 * }
 */
var allTwits = [];

/*
 * This function checks whether all of the required inputs were supplied by
 * the user and, if so, inserts a new twit into the page using these inputs.
 * If the user did not supply a required input, they instead recieve an alert,
 * and no new twit is inserted.
 */
function handleModalAcceptClick() {

  var twitText = document.getElementById('twit-text-input').value;
  var twitAuthor = document.getElementById('twit-author-input').value;

  /*
   * Only generate the new twit if the user supplied values for both the twit
   * text and the twit attribution.  Give them an alert if they didn't.
   */
  if (twitText && twitAuthor) {

    allTwits.push({
      text: twitText,
      author: twitAuthor
    });

    clearSearchAndReinsertTwits();

    hideCreateTwitModal();

  } else {

    alert('You must specify both the text and the author of the twit!');

  }
}


/*
 * This function clears the current search term, causing all twits to be
 * re-inserted into the DOM.
 */
function clearSearchAndReinsertTwits() {

  document.getElementById('navbar-search-input').value = "";
  doSearchUpdate();

}


/*
 * This function shows the modal to create a twit when the "create twit"
 * button is clicked.
 */
function showCreateTwitModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createTwitModal = document.getElementById('create-twit-modal');

  // Show the modal and its backdrop.
  modalBackdrop.classList.remove('hidden');
  createTwitModal.classList.remove('hidden');

}


/*
 * This function clears any value present in any of the twit input elements.
 */
function clearTwitInputValues() {

  var twitInputElems = document.getElementsByClassName('twit-input-element');
  for (var i = 0; i < twitInputElems.length; i++) {
    var input = twitInputElems[i].querySelector('input, textarea');
    input.value = '';
  }

}


/*
 * This function hides the modal to create a twit and clears any existing
 * values from the input fields whenever any of the modal close actions are
 * taken.
 */
function hideCreateTwitModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createTwitModal = document.getElementById('create-twit-modal');

  // Hide the modal and its backdrop.
  modalBackdrop.classList.add('hidden');
  createTwitModal.classList.add('hidden');

  clearTwitInputValues();

}


/*
 * A function that determines whether a given twit matches a search query.
 * Returns true if the twit matches the query and false otherwise.
 */
function twitMatchesSearchQuery(twit, searchQuery) {
  /*
   * An empty query matches all twits.
   */
  if (!searchQuery) {
    return true;
  }

  /*
   * The search query matches the twit if either the twit's text or the twit's
   * author contains the search query.
   */
  searchQuery = searchQuery.trim().toLowerCase();
  return (twit.author + " " + twit.text).toLowerCase().indexOf(searchQuery) >= 0;
}


/*
 * Perform a search over over all the twits based on the search query the user
 * entered in the navbar.  Only display twits that match the search query.
 * Display all twits if the search query is empty.
 */
function doSearchUpdate() {

  /*
   * Grab the search query from the navbar search box.
   */
  var searchQuery = document.getElementById('navbar-search-input').value;

  /*
   * Remove all twits from the DOM temporarily.
   */
  var twitContainer = document.querySelector('.twit-container');
  if (twitContainer) {
    while (twitContainer.lastChild) {
      twitContainer.removeChild(twitContainer.lastChild);
    }
  }

  /*
   * Loop through the collection of all twits and add twits back into the DOM
   * if they match the current search query.
   */
  allTwits.forEach(function (twit) {
    if (twitMatchesSearchQuery(twit, searchQuery)) {
      insertNewTwit(twit.text, twit.author);
    }
  });

}


/*
 * This function parses an existing DOM element representing a single twit
 * into an object representing that twit and returns that object.  The object
 * is structured like this:
 *
 * {
 *   text: "...",
 *   author: "..."
 * }
 */
function parseTwitElem(twitElem) {

  var twit = {};

  var twitTextElem = twitElem.querySelector('.twit-text');
  twit.text = twitTextElem.textContent.trim();

  var twitAuthorLinkElem = twitElem.querySelector('.twit-author a');
  twit.author = twitAuthorLinkElem.textContent.trim();

  return twit;

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  // Remember all of the existing twits in an array that we can use for search.
  var twitElemsCollection = document.getElementsByClassName('twit');
  for (var i = 0; i < twitElemsCollection.length; i++) {
    allTwits.push(parseTwitElem(twitElemsCollection[i]));
  }

  var createTwitButton = document.getElementById('create-twit-button');
  if (createTwitButton) {
    createTwitButton.addEventListener('click', showCreateTwitModal);
  }

  var modalCloseButton = document.querySelector('#create-twit-modal .modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', hideCreateTwitModal);
  }

  var modalCancalButton = document.querySelector('#create-twit-modal .modal-cancel-button');
  if (modalCancalButton) {
    modalCancalButton.addEventListener('click', hideCreateTwitModal);
  }

  var modalAcceptButton = document.querySelector('#create-twit-modal .modal-accept-button');
  if (modalAcceptButton) {
    modalAcceptButton.addEventListener('click', handleModalAcceptClick);
  }

  var searchButton = document.getElementById('navbar-search-button');
  if (searchButton) {
    searchButton.addEventListener('click', doSearchUpdate);
  }

  var searchInput = document.getElementById('navbar-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', doSearchUpdate);
  }

});
