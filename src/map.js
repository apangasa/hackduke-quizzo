class QuestionMap {
	constructor() {
    	let qMap = new Map()
    	qMap['neurons'] = [
            {
                "q": "Is a neuron a cell?", 
                "a": "Yes", 
                "score": 100
            },
            {
                "q": "How many neurons in the brain?", 
                "a": "trillions", 
                "score": 500
            }
        ]
        qMap['molecules'] = [
            {
                "q": "Does water contain oxygen?", 
                "a": "Yes", 
                "score": 100
            },
            {
                "q": "Number of molecules in face", 
                "a": "trillions", 
                "score": 500
            }
        ]

        let topicSet = new Set()
        topicSet.add("neurons")
        topicSet.add("molecules")

        this.qMap = qMap
        this.topicSet = topicSet
    }
    
	getQuestions(topic) {
    	return this.mapper[topic];
    }

    isTopic(topic) {
        return this.topicSet.has(topic);
    }
}