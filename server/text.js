var watson = require('watson-developer-cloud');
var fs = require('fs');

var text_to_speech = watson.text_to_speech({
  username: 'c15c5386-df70-4df1-ab77-5813b74943e8',
  password: 'GMmW3lXBBI0g',
  version: 'v1'
});

var params = {
  text: "You know you love me, I know you careJust shout whenever, and I'll be thereYou are my love, you are my heartAnd we would never ever ever be apartAre we an item? Girl, quit playingWe're just friends, what are you saying?Say there's another and look right in my eyesMy first love broke my heart for the first timeAnd I was like...Baby, baby, baby ooohLike baby, baby, baby noooLike baby, baby, baby ooohI thought you'd always be mine (mine)Baby, baby, baby ooohLike baby, baby, baby noooLike baby, baby, baby ooohI thought you'd always be mine (mine)Oh, for you I would have done whateverAnd I just can't believe we ain't togetherAnd I wanna play it cool, but I'm losin' youI'll buy you anything, I'll buy you any ringAnd I'm in pieces, baby fix meAnd just shake me 'til you wake me from this bad dreamI'm going down, down, down, downAnd I just can't believe my first love won't be aroundAnd I'm likeBaby, baby, baby ooohLike baby, baby, baby noooLike baby, baby, baby ooohI thought you'd always be mine (mine)Baby, baby, baby ooohLike baby, baby, baby noooLike baby, baby, baby ooohI thought you'd always be mine (mine)[Ludacris:]Luda! When I was 13, I had my first love,There was nobody that compared to my babyAnd nobody came between us or could ever come aboveShe had me going crazy, oh, I was star-struck,She woke me up daily, don't need no Starbucks.She made my heart pound, it skipped a beat when I see her in the street andAt school on the playground but I really wanna see her on the weekend.She knows she got me dazing cause she was so amazingAnd now my heart is breaking but I just keep on saying...Baby, baby, baby ooohLike baby, baby, baby noooLike baby, baby, baby ooohI thought you'd always be mine (mine)Baby, baby, baby ooohLike baby, baby, baby noooLike baby, baby, baby ooohI thought you'd always be mine (mine)I'm gone (Yeah Yeah Yeah, Yeah Yeah Yeah)Now I'm all gone (Yeah Yeah Yeah, Yeah Yeah Yeah)Now I'm all gone (Yeah Yeah Yeah, Yeah Yeah Yeah)Now I'm all gone (gone, gone, gone...)I'm gone",
  voice: 'en-US_AllisonVoice', // Optional voice
  accept: 'audio/wav'
};

// Pipe the synthesized text to a file
text_to_speech.synthesize(params).pipe(fs.createWriteStream('output.wav'));