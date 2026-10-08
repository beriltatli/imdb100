// The watchlist: [title, year, runtime in minutes], in list order.
// Edit this file to change the films; numbering (№ 001…) follows the array order.
const FILMS = [
["The Prestige",2006,130],["The Dark Knight",2008,152],["V for Vendetta",2005,132],["Inception",2010,148],["Oldboy",2003,120],
["Schindler's List",1993,196],["Donnie Darko",2001,113],["Fight Club",1999,139],["Rocky",1976,120],["The Usual Suspects",1995,106],
["Memento",2000,113],["12 Angry Men",1957,96],["Forrest Gump",1994,142],["Scarface",1983,170],["Black Swan",2010,108],
["L.A. Confidential",1997,138],["The Machinist",2004,101],["Eternal Sunshine of the Spotless Mind",2004,108],["The Godfather",1972,175],["Batman Begins",2005,140],
["Star Wars: Episode III – Revenge of the Sith",2005,140],["The Green Mile",1999,189],["The Empire Strikes Back",1980,124],["The Last Samurai",2003,154],["Se7en",1995,127],
["The Matrix",1999,136],["The Blair Witch Project",1999,81],["The Hangover",2009,100],["Slumdog Millionaire",2008,120],["(500) Days of Summer",2009,95],
["Léon: The Professional",1994,110],["Shutter Island",2010,138],["A Beautiful Mind",2001,135],["The Dark Knight Rises",2012,164],["Django Unchained",2012,165],
["Drive",2011,100],["The Lord of the Rings: The Return of the King",2003,201],["The Skin I Live In",2011,120],["Inglourious Basterds",2009,153],["Babel",2006,143],
["Seven Pounds",2008,123],["Training Day",2001,122],["Amores Perros",2000,154],["3:10 to Yuma",2007,122],["Life Is Beautiful",1997,116],
["City of God",2002,130],["Cloverfield",2008,85],["One Flew Over the Cuckoo's Nest",1975,133],["Saw",2004,103],["Saving Private Ryan",1998,169],
["Rain Man",1988,133],["Gladiator",2000,155],["The Shawshank Redemption",1994,142],["The Intouchables",2011,112],["Titanic",1997,194],
["Blood Diamond",2006,143],["Life of Pi",2012,127],["The Curious Case of Benjamin Button",2008,166],["The Count of Monte Cristo",2002,131],["Argo",2012,120],
["Requiem for a Dream",2000,102],["Gangs of New York",2002,167],["There Will Be Blood",2007,158],["American History X",1998,119],["The Truman Show",1998,103],
["The Lord of the Rings: The Two Towers",2002,179],["American Psycho",2000,102],["WALL·E",2008,98],["Mystic River",2003,138],["Rosemary's Baby",1968,137],
["A Clockwork Orange",1971,136],["The Departed",2006,151],["The Lion King",1994,88],["The Lord of the Rings: The Fellowship of the Ring",2001,178],["The Mask",1994,101],
["Star Wars: Episode I – The Phantom Menace",1999,136],["11:14",2003,86],["Return of the Jedi",1983,131],["In July",2000,99],["The Tree of Life",2011,139],
["Vanilla Sky",2001,136],["Goodfellas",1990,145],["Silver Linings Playbook",2012,122],["Changeling",2008,141],["The Aviator",2004,170],
["Magnolia",1999,188],["La Vie en Rose",2007,140],["The Good, the Bad and the Ugly",1966,161],["Pan's Labyrinth",2006,118],["21 Grams",2003,124],
["Meet Joe Black",1998,178],["The Shining",1980,146],["Amadeus",1984,160],["Casino",1995,178],["The Village",2004,108],
["Platoon",1986,120],["The Italian Job",2003,111],["The Thirteenth Floor",1999,100],["The Hidden Face",2011,97],["Sunset Boulevard",1950,110]
];
const ERAS = [
  { label: "1950–79", max: 1979, color: "#7FC8C2" },
  { label: "1980s",   max: 1989, color: "#9A7BD1" },
  { label: "1990s",   max: 1999, color: "#E2552D" },
  { label: "2000s",   max: 2009, color: "#F2B632" },
  { label: "2010s",   max: 2099, color: "#4F8F5C" }
];
