function eID(id) {return document.getElementById(id)};

//Finds the value of metadata before the start of a chart (Ex. TITLE, WAVE, BALLOON, etc)
function mdValue(metadata, chart) {
	if (chart.search(RegExp(`${metadata}`, "gm")) == -1) {console.log(`No ${metadata} found.`); return "";}
	else return chart.split("\n")[lineOf(chart, metadata) - 1].split(":")[1].replace(/\n/g, "")
}

function start(mode) {
	let modes = ["menu", "danMaker", "combiner"]
	
	for (let i = 0; i < modes.length; i++) {
		eID(modes[i]).style.display = (modes[i] == mode ? "inline" : "none")
	}
}

function danMakerPhaseSet(phase) {
// 0: songs, 1: conditions, 2: charts
let dmt = eID("danMakerText")
let dmi = eID("danMakerInput")
	switch (phase) {
		case 0: //song amount
			dmt.innerHTML = "How many songs would you like your dan to have? (1-10)<br><i style='color:#FFFFFF80; font-size:12px;'>If you really need more, go to Inspect and change the max yourself.</i>"
			dmi.placeholder = "3";  dmi.type = "number";  dmi.min = "1";  dmi.max = "10";
		break;
		
		case 1: //exam amount
			if (isNaN(parseInt(dmi.value)) || dmi.value < 1 || dmi.value > parseInt(dmi.max)) {
				dmt.innerHTML = "<i style='color:#FF8080B0; font-size:12px'>There was an error, please try again</i><br>How many songs would you like your dan to have? (1-10)<br><i style='color:#FFFFFF80; font-size:12px;'>If you really need more, go to Inspect and change the max yourself.</i>"
				danMakerPhase = 0
			} else {
				danData.songs = parseInt(dmi.value)
				dmt.innerHTML = "How many conditions would you like your dan to have? (1-5)<br><i style='color:#FFFFFF80; font-size:12px;'>If you really need more, go to Inspect and change the max yourself.</i>"
				dmi.placeholder = "3";  dmi.max = "5";
			}
		break;
		
		case 2: //chart files
			if (isNaN(parseInt(dmi.value)) || dmi.value < 1 || dmi.value > dmi.max) {
				dmt.innerHTML = "<i style='color:#FF8080B0; font-size:12px'>There was an error, please try again</i><br>How many conditions would you like your dan to have? (1-5)<br><i style='color:#FFFFFF80; font-size:12px;'>If you really need more, go to Inspect and change the max yourself.</i>"
				danMakerPhase = 1
			} else {
				danData.exams = parseInt(dmi.value)
				dmt.innerHTML = `Please insert your chart${danData.songs == 1 ? '' : 's'}:`
				dmi.style.display = "none";
				
				for (let i = 0; i < danData.songs; i++) {
					dmt.innerHTML += `<br><br><input id='dds${i+1}' type='file'></input>`
				}
				
				for (let i = 0; i < danData.songs; i++) {
					eval(`
					document.getElementById('dds${i+1}').addEventListener('change', function() {	
						let fr=new FileReader();
						fr.onload=function(){
							danData.charts[i]=fr.result;
						}
						fr.readAsText(this.files[0]);
					})
					`)
				}
			}
		break;
		
		case 3: //conditions
			dmt.innerHTML = "What will your conditions be?"
				for (let i = 0; i < danData.exams; i++) {
					dmt.innerHTML += `<br><br>
					<label for="dct${i+1}">Condition ${i+1}</label>
					<select name='dct${i+1}' id='dct${i+1}'>
					<option value="a">Accuracy (OpenTaiko Only)</option>
					<option value="c">Max Combo</option>
					<option value="g">Soul Gauge %</option>
					<option value="h">Hits <i>(Notes Hit + Drumrolls)</i></option>
					<option value="jb" style="color:#80B">BAD Amount</option>
					<option value="jg" style="color:#8FF">OK Amount</option>
					<option value="jp" style="color:#F81">GOOD Amount</option>
					<option value="r">Drumrolls</option>
					<option value="s">Score</option>
					</select>`
				}
		break;
		
		case 4: { //condition values
			for (let i = 0; i < danData.exams; i++) {
				danData.conditions.push(["type", "value or values"])
				danData.conditions[i][0] = eID(`dct${i+1}`).value
			}
			dmt.innerHTML = "What will the value of your conditions be?<br><i style='color:#FFFFFFC0; font-size:15px;'>(Put spaces if you want multiple songs per condition)</i>"
				for (let i = 0; i < danData.exams; i++) {
					dmt.innerHTML += `<br><br>Condition ${i+1}:
					<select name='dcve${i+1}' id='dcve${i+1}' style="width:40px;">
					<option value="m">≥</option>
					<option value="l">&lt;</option>
					</select>
					<input type="text" id="dcvn${i+1}" style="width:200px;" placeholder="Pass"></input>
					<input type="text" id="dcvgn${i+1}" style="width:200px;" placeholder="Gold Pass"></input>
					`
				}
		}
		break;
		
		case 5: { //dan metadata
			for (let i = 0; i < danData.exams; i++) {
				danData.conditions[i][1] = [eID(`dcve${i+1}`).value, [eID(`dcvn${i+1}`).value.split(" "), eID(`dcvgn${i+1}`).value.split(" ")]]
			}
			
			dmt.innerHTML = `What is the info of this dan?
			
			Title <input id='dt'></input><br>
			Subtitle <input id='ds'></input><br>
			★ <input id='dl' type='number'></input><br>
			`
		}
		break;
		
		case 6: { //making
			danData.info = [eID("dt").value, eID("ds").value, eID("dl").value]
			dmt.innerHTML = '<h3>Making...</h3><br><i>If it takes too long, there could be an error.</i>'
			dmt.innerHTML = `<h3>All good! Have fun! :)</h3><br><h5><i>Click "Continue" to download the dan's tja.</i></h5><span style="text-align:left !important;">${makeDan(false).replace(/\n/g, "<br>")}</span>`
		}
		break;
		
		case 7: { //downloader
			makeDan(true)
			danMakerPhase = 6
		}
		break;
	}
}

function fullCombiner() {
	let cm = combine(eID("cl1").value, eID("cl2").value)
	eID("cr").innerHTML = cm
}

start("menu");