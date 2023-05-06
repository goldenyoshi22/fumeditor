
var danMakerPhase = 0
var danData = {
	songs: 0,
	exams: 0,
	charts: [],
	
	conditions: [],
	/*
	a = accuracy (OpenTaiko only)
	c = max combo
	g = soul gauge%
	h = hits (notes hit + drumrolls)
	jb = bad amount
	jg = ok amount
	jp = good amount
	r = drumrolls
	s = score
	
	l = less than x
	m = x or more
	
	layer1=exam#, layer2=0:type, 1:value, layer3=0:m or l, 1:numbers, layer4=0:red, 1:gold, layer5=individual song values (if there's one it's the whole dan)
	i'm deeply sorry for how messed up this is structured LOL
	*/
	
	info: ["dan name", "dan subtitle", 10]
	/*
	title, subtitle, level
	*/
}

function danMakeSong(chart, type) {
	if (type == "info") {
	let info = [
		mdValue("TITLE", chart),
		mdValue("SUBTITLE", chart),
		mdValue("GENRE", chart),
		mdValue("WAVE", chart),
		mdValue("SCOREINIT", chart),
		mdValue("SCOREDIFF", chart),
		mdValue("LEVEL", chart),
		mdValue("COURSE", chart)
	]
	return `#NEXTSONG ${info.join(',').replace(/\n/g, '')}\n#BPMCHANGE ${mdValue("BPM", chart)}\n#DELAY ${mdValue("OFFSET", chart) * -1}`.replace(/\r/g, "")
	} else {
		return chart.substring(chart.indexOf("#START"), chart.indexOf("#END"))
	}
}

function danMakeExam(condition, examnum=1, songnum=1) {
	if (condition[1][1][0].length > 1) {
		return `EXAM${examnum}:${condition[0]},${condition[1][1][0][songnum]},${condition[1][1][1][songnum]},${condition[1][0]}`
	} else {
		return `EXAM${examnum}:${condition[0]},${condition[1][1][0][0]},${condition[1][1][1][0]},${condition[1][0]}`
	}
}

function makeDan(save = false) {
	let balloon = ``;
	let bn2 = ``;
	for (let i = 0; i < danData.charts.length; i++) {
		bn2 = isNaN(mdValue("BALLOON", danData.charts[i])) ? "" : mdValue("BALLOON", danData.charts[i])
		balloon += bn2
		if (bn2 != "") balloon += ","
	}
	
	
	let finalDan = ``;
	
	finalDan += `
TITLE:${danData.info[0]}
SUBTITLE:${danData.info[1]}
BPM:${mdValue("BPM", danData.charts[0])}
WAVE:${mdValue("WAVE", danData.charts[0])}
DEMOSTART:${mdValue("DEMOSTART", danData.charts[0])}
	
COURSE:Dan
LEVEL:${danData.info[2]}
BALLOON:${balloon}
`
	for (let i = 0; i < danData.conditions.length; i++) {
		if (danData.conditions[i][1][1][0].length <= 1) {
			finalDan += danMakeExam(danData.conditions[i], i+1) + `\n`
		}
	}
	
	finalDan += `#START\n`
	
	let songpiece = []
	
	for (let i = 0; i < danData.charts.length; i++) {
		songpiece.push(danMakeSong(danData.charts[i], "info") + `\n`)
	for (let j = 0; j < danData.conditions.length; j++) {
		if (danData.conditions[j][1][1][0].length > 1) {
			songpiece[i] = songpiece[i].slice(0, songpiece[i].indexOf("#BPMCHANGE")) + danMakeExam(danData.conditions[j], j+1, i) + `\n` + songpiece[i].slice(songpiece[i].indexOf("#BPMCHANGE"))
		}
	}
		songpiece[i] += danMakeSong(danData.charts[i], "chart").replace("#START", "") + `\n\n`
	}
	
	finalDan += songpiece.join("")
	
	finalDan += `#END`
	
	if (save) {
		download(`${danData.info[0]}.tja`, finalDan)
	}
	
	return finalDan
}