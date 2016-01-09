# hotbutton

Requirements:
- nodejs
- mongodb

Run 
``npm install``
 to install dependencies and then

``npm start``

Click on the app directory to see the served directory.

## database model:

```
{"posts":[
	{"_id":"1",
	"candidate":"Hillary Clinton",
	"issue":"Foreign Policy",
	"score":-5,
	"parent": null,
	"text": "Hillary really screwed up in Benghazi just like she would screw up the rest of the country",
	"sources" : ["www.cnn.com"]
	},
	{"_id": "2",
	"candidate":"Bernie Sanders",
	"issue":"Economy",
	"score": -2,
	"parent": null,
	"text": "Bernie thinks that there's more money in the world than there really is",
	"sources":["www.wsj.com"]
	},
	{"_id": "3",
	"candidate":"Hillary Clinton",
	"issue":"Personal Hygiene",
	"score": 5,
	"parent": null,
	"text": "I heard she took a bath last Sunday, and I also took a bath on Sunday, so I think we're pretty much the same.",
	"sources":["www.bedbathandbeyond.com", "http://www.indulgespa.net/"]
	},
	{"_id": "4",
	"candidate":"Donald Trump",
	"issue":"Personal Hygiene",
	"score": -2,
	"parent": null,
	"text": "Obviously a shower man, ergo, untrustworthy",
	"sources":["www.bbc.com", "http://www.cnn.com"]
	},
	{"_id":"5",
	"candidate":"Ted Cruz Jr.",
	"issue":"Immigration",
	"score":3,
	"parent":null,
	"text": "Seems to not want any immigrants, and immigrants make me sad.",
	"sources":[{"source1":"www.foxnews.com"}]
	}
]}
```

## Server API

### GET
* /search (actually a POST in order to send search data)
* /my_factoids
* /candidates
* /issues

### POST
* /update_factoids
