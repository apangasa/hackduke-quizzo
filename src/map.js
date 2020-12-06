class Questions {
	constructor() {
    	let qMap = new Map()
    	qMap['acids'] = [
            {
                "q": "Acids dissociate to produce?", 
                "a": "Hydrogen ions", 
                "score": 500
            },
            {
                "q": "Is HCl and acid?", 
                "a": "yes", 
                "score": 100
            },
            {
                "q": "Is NaOH an acid?", 
                "a": "yes", 
                "score": 200
            },
            {
                "q": "What pH is neutral?", 
                "a": "7", 
                "score": 300
            },
            {
                "q": "Is the stomach acidic or basic?", 
                "a": "acidic", 
                "score": 400
            }
        ]
        qMap['digestion'] = [
            {
                "q": "Digestion is a _ process", 
                "a": "mechanical", 
                "score": 300
            },
            {
                "q": "Promotes chemical digestion?", 
                "a": "enzymes", 
                "score": 200
            },
            {
                "q": "The stomach enzyme is?", 
                "a": "pepsin", 
                "score": 500
            },
            {
                "q": "Process by which nutrients are taken in?", 
                "a": "absorption", 
                "score": 400
            },
            {
                "q": "First stage of food processing?", 
                "a": "ingestion", 
                "score": 100
            }
        ]

        let topicSet = new Set()
        topicSet.add("acids")
        topicSet.add("digestion")

        this.qMap = qMap
        this.topicSet = topicSet
    }
    
	  getQuestions(topic) {
    	return this.qMap[topic];
    }

    isTopic(topic) {
        return this.topicSet.has(topic);
    }
}