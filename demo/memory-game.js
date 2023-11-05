"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */


const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple", "yellow",
  "red", "blue", "green", "orange", "purple", "yellow"
];

const colors = shuffle(COLORS);

createCards(colors);

const matchesToWin = COLORS.length/2
const win = document.querySelector('#winner')
const showScore = document.getElementById("score")
const showBestScore = document.getElementById('bestScore')

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.querySelector("#game");

  for (let color of colors) {
    let gameCard = document.createElement('div')
    gameCard.classList.add(color)
    gameBoard.appendChild(gameCard)
    gameCard.addEventListener('click', handleCardClick)
  }
}


/** Flip a card face-up. */
function flipCard(card) {
card.style.backgroundColor = card.className
return;
}

/** Flip a card face-down. */
function unFlipCard(card) {
  firstCard.style.backgroundColor = null;
  secondCard.style.backgroundColor = null;
  //reset starting position
  firstCard = null
  secondCard = null
  return;
}


let firstCard = null;
let secondCard = null;
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore"))
showBestScore.innerText = bestScore //shows best score with page refresh
let matches = 0;


/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick(evt) {
  let curCard = evt.target

  //if the card is already matched or the selected card is already selected
  if(curCard.className === 'matched' || curCard === firstCard || secondCard){
    return;
  }
  flipCard(curCard)

  //if there is no first card selected, first card is the current card
  if(!firstCard){
    firstCard = curCard;
    return;
  }

  //score counter after every pair/guess
  score++
  showScore.innerText = score


  //if there is a first card selcted, compare first card class to current card class
  //change class to 'matched' if its a match
  const checkMatch = firstCard.getAttribute('class')

  if(checkMatch === curCard.className){
    firstCard.setAttribute("class", "matched")
    curCard.setAttribute("class", "matched")

    matches++
    firstCard = null;

    if(matches === matchesToWin){
      gameOver()
    }

    return;
  }
  //if there is no match, assign cur card to second card and call for unflip
  secondCard = curCard;
  setTimeout(unFlipCard, 1000)
}

//GAME OVER
function gameOver(){
  win.innerText = 'YOU WIN'
  win.style.color = '#e0e0e0'
  win.style.fontWeight = "900"
  win.style.fontSize = '40px'

  if(bestScore === '0'){
    bestScore = score
  }else{
    bestScore = Math.min(score, bestScore)
  }
  localStorage.setItem('bestScore', bestScore)
  showBestScore.innerHTML = bestScore

}

//RESTART GAME
const resetGame = document.querySelector('button')
resetGame.addEventListener('click', resetBoard)

function resetBoard (){
  //get all divs that are not the #game container
  let gameCards = document.querySelectorAll('div:not(#game)')

  //reset variables
  win.innerText = ''
  firstCard = null;
  secondCard = null;
  score = 0;
  matches = 0;
  showScore.innerText = score
  showBestScore.innerHTML = bestScore

  //remove background/card from the game board
  for(let card of gameCards){
    card.remove()
  }
  //call for a new shuffle
  let recreateCards = shuffle(COLORS)
  createCards(recreateCards)
}
