//Detects links inside text and transform them into clickable links

export function linkify(text) {
    if (text) {
      var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return text.replace(urlRegex, function(url) {
          return '<mark><a href="' + url + '" target="_blank">' + url + '</a><mark>';
      });
    }
}
