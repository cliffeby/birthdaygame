/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 * TO TEST LAMBDA LOCALLY SEE LINK BELOW
 * http://docs.bespoken.io/en/latest/tutorials/tutorial_lambda_local/
 * cd fact/skill-sample-nodejs-fact/lambda/custom
 * cd to this directory and enter bst proxy lambda index.js --verbose
 * Use Postman to send requests to this local Lambda function
 **/

'use strict';
const Alexa = require('alexa-sdk');
const highLimit = 100;

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

var states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
    STARTMODE: '_STARTMODE',
    STARTMODE1: '_STARTMODE1',
    STARTMODE2: '_STARTMODE2',
    CONFIGMODE: '_CONFIGMODE'
};

const SKILL_NAME = 'Birthday Game ';
var   celebNumber, guessAge;

const questions = [
    { "Name":"Don Smith", "Age":"55", "M": true},
    { "Name":"Clifford the big red dog", "Age":"66", "M": true},
    { "Name":"Eugenia Eiselman", "Age":"55", "M": false},
    { "Name":"Sam", "Age":"55", "M": true},
    { "Name":"Don2", "Age":"55", "M": true},
    { "Name":"Bill2", "Age":"55", "M": true},
    { "Name":"Art2", "Age":"55", "M": true},
    { "Name":"Sam2", "Age":"55", "M": true}
];
const gameString =  {
    'QUESTIONS': questions['QUESTIONS_EN_US'],
    'GAME_NAME': 'The Birthday Game', // Be sure to change this for your skill.
    'HELP_MESSAGE': 'I will ask you about %s people that have birthdays today. Respond with their age. ' +
    'For example, say 35. To start a new game at any time, say, start game. ',
    'REPEAT_QUESTION_MESSAGE': 'To repeat the last birthday, say, repeat. ',
    'ASK_MESSAGE_START': 'Would you like to start playing?',
    'HELP_REPROMPT': 'To give an answer, respond with their age. ',
    'STOP_MESSAGE': 'Would you like to keep playing?',
    'CANCEL_MESSAGE': 'Ok, let\'s play again soon.',
    'NO_MESSAGE': 'Ok, we\'ll play another time. Goodbye!',
    'TRIVIA_UNHANDLED': 'Please give me an age',
    'HELP_UNHANDLED': 'Say yes to continue, or no to end the game.',
    'START_UNHANDLED': 'Say start to start a new game.',
    'NEW_GAME_MESSAGE': 'Welcome to %s. ',
    'WELCOME_MESSAGE': 'I will ask you about %s people that have birthdays today, lets see how many you get right. ' +
    'Let\'s begin. ',
    'ANSWER_CORRECT_MESSAGE': 'correct. ',
    'ANSWER_WRONG_MESSAGE': 'wrong. ',
    'CORRECT_ANSWER_MESSAGE': 'The correct age is %s: %s. ',
    'ANSWER_IS_MESSAGE': 'That answer is ',
    'TELL_QUESTION_MESSAGE': 'Question %s. %s ',
    'GAME_OVER_MESSAGE': 'You got %s out of %s ages correct. Thank you for playing!',
    'SCORE_IS_MESSAGE': 'Your score is %s. '
};

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers,
        startCelebHandlers, guessAttemptHandlers, configModeHandlers);
    alexa.execute();
};
var newSessionHandlers = {

    // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
            this.attributes['endedSessionCount'] = 0;
            this.attributes['gamesPlayed'] = 0;
            this.attributes['celebsTried'] = 0;
            this.attributes['guessAttempt'] = 0;
            this.attributes['randomCeleb'] = -1;
        }
        this.handler.state = states.STARTMODE;
        this.attributes['celebsTried'] = 0;
        this.attributes['guessAttempt'] = 0;
        console.log('ATTRIBUTES-NEW SESSION',this.attributes);
        this.emit(':ask', 'Welcome to the Birthday Game.  Would you like to play?',
            'Say Yes to start the game, Settings to change settings, or No to quit.');
    }
};

var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {

    'NewSession': function () {
        console.log('NEWSESSION- startGameHandler');
        this.attributes['gamesPlayed'] += 1;
       this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },

    'AMAZON.HelpIntent': function() {
        var message = 'I will give you four celebrities with birthdays today.  You guess their age. Do you want to start the game?';
        this.emit(':ask', message, message);
    },

    'AMAZON.YesIntent': function() {
        //this.attributes['guessNumber'] = Math.floor(Math.random() * highLimit);
        this.handler.state = states.STARTMODE1;
        console.log('ATTRIBUTES-STARTGAME',this.attributes);
        this.emit(':ask', 'I will tell you about four celebrities with birthdays today.  You guess their age. Are you ready to start?', 'Say yes');
    },

    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Ok, see you next time!');
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        var message = 'Game0Handler Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});
var startCelebHandlers = Alexa.CreateStateHandler(states.STARTMODE1, {

    'NewSession': function () {
        console.log('NEWSESSION- startCelebHandler');
        this.attributes['celebsTried']++;
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },

    'AMAZON.HelpIntent': function() {
        var message = 'HELP in startGame1Handler';
        this.emit(':ask', message, message);
    },

    'AMAZON.YesIntent': function() {
        this.attributes['randomCeleb']++;
        // this.attributes['randomCeleb'] = Math.floor(Math.random() * 8);
        this.attributes['guessAttempt'] = 0;
        celebNumber = this.attributes['randomCeleb']
        this.attributes['celebName'] = questions[celebNumber].Name;
        console.log('CELEBNAME', celebNumber, this.attributes['celebName']);
        console.log('ATTRIBUTES-startCelebHandler', this.attributes);
        this.handler.state = states.GUESSMODE;
        this.emit(':ask', 'Great Player 1! ' + 'How old is ' + questions[celebNumber].Name + '?  What is your guess?', 'Try saying an age.');
    },

    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Ok, see you next time!');
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        var message = 'Game1Handler Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});

var guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    'NewSession': function () {
        console.log('NEWSESSION- guessModeHandler'); // Equivalent to the Start Mode NewSession handler
    },

   'NumberGuessIntent': function() {
       console.log('NumberGuessIntent', this.event.request);
        guessAge = parseInt(this.event.request.intent.slots.number.value);
        var actualAge = questions[celebNumber].Age;
        if (this.attributes['guessAttempt']>=3){
            this.handler.state = states.STARTMODE1;
        }
        this.attributes['celebName'] = questions[celebNumber].Name;
        console.log('user guessed/actual ' + guessAge, " ", actualAge);
        this.attributes['guessAttempt']++;
        if(guessAge > highLimit) {
            this.emit('OutOfRange', guessAge);
            this.attributes['guessAttempt']--;
        }
        if(guessAge > actualAge){
            this.emit('TooHigh', guessAge, actualAge, () => {});
        } else if(guessAge < actualAge){
            this.emit('TooLow', guessAge, actualAge, () => {});
        } else if (guessAge == actualAge){
            // With a callback, use the arrow function to preserve the correct 'this' context
            this.emit('JustRight', () => {});
            console.log('ATTRIBUTES-Guess2',this.attributes);
        } else {
            this.attributes['guessAttempt']--;
            this.emit('NotANum');
        }
    },

    'AMAZON.HelpIntent': function () {
        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
        this.emit(':saveState', true);
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
        this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
    },

    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Guess an age.', 'Try saying a number.');
    }

});
// These handlers are not bound to a state
const guessAttemptHandlers = {
    'TooHigh': function(guess,actual) {
        this.response.speak(guess.toString() + ' is too high.')
            .listen('Try younger.');
        if (this.attributes['guessAttempt']>=3) {
            this.attributes['celebsTried']++;
            if (this.attributes['celebsTried']>=3) {
                this.handler.state = states.STARTMODE;
                var message = 'Incorrect.  No more guesses for' + this.attributes['celebName'] + ' He is ' + actual.toString() + ' years old.  That ends the game.  do you want to play again?';
                this.emit(':ask', message, message);
            }
            this.attributes['guessAttempt'] = 0;
            this.handler.state = states.STARTMODE1;
            var message = 'Incorrect.  No more guesses' + this.attributes['celebName'] + ' is ' + actual.toString() + ' years old.  Are you ready for the next celebrity?';
            this.emit(':ask', message, message);
        }
        this.emit(':responseReady');
    },
    'TooLow': function(guess, actual) {
        this.response.speak(guess.toString() + ' is too low.')
            .listen('Try older.');
        if (this.attributes['guessAttempt']>=3) {
            this.attributes['celebsTried']++;
            if (this.attributes['celebsTried']>=3) {
                this.handler.state = states.STARTMODE;
                var message = 'Incorrect.  No more guesses for' + this.attributes['celebName'] + ' He is ' + actual.toString() + ' years old.  That ends the game.  do you want to play again?';
                this.emit(':ask', message, message);
            }
            this.attributes['guessAttempt'] = 0;
            this.handler.state = states.STARTMODE1;
            var message = 'Incorrect.  No more guesses for' + this.attributes['celebName'] + ' He is ' + actual.toString() + ' years old.  Are you ready for the next celebrity?';
            this.emit(':ask', message, message);
        }
        this.emit(':responseReady');
    },
    'JustRight': function() {
        this.response.speak('Correct, Ding Ding' + this.attributes['celebName'] + ' is ' + guessAge.toString() + ' years old.  Ready for the next celebrity?')
            .listen('');
        this.handler.state = states.STARTMODE1;
        this.attributes['celebsTried']++;
        if (this.attributes['celebsTried']>=3){
            this.attributes['celebsTried']= 0;
            this.attributes['guessAttempt']=0;
            this.response.speak('Correct, Ding Ding' + this.attributes['celebName'] + ' is ' + guessAge.toString() + ' years old.  That ends the game.  do you want to play again?')
                .listen('');
            this.emit(':responseReady');
            this.handler.state = states.STARTMODE;
            console.log('JustRight', this.attributes);
            callback();
        }
        this.emit(':responseReady');
        callback();
    },
    'OutOfRange': function(val) {
        this.response.speak(val.toString() + ' is out of range. MeeMaw says I, yai, yai little one. Try a number under'+ highLimit.toString())
            .listen('Try a number under' + highLimit.toString());
        this.emit(':responseReady');
    },
    'NotANum': function() {
        this.response.speak('Sorry, I didn\'t get that. Try saying a number.')
            .listen('Try saying a number.');
        this.emit(':responseReady');
    }
};
var configModeHandlers = Alexa.CreateStateHandler(states.CONFIGMODE, {

    'NewSession': function () {
        console.log('NEWSESSION- startGameHanler');
        //   this.emit('NewCeleb'); // Uses the handler in newSessionHandlers
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Guess an age.', 'Try saying a number.');
    }

});