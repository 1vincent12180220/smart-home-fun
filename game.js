
'use strict';
const $=id=>document.getElementById(id);
const labels={'SENSOR ERROR':'感測器錯誤','HIGH TEMP':'高溫警示','HIGH HUMIDITY':'高濕警示','LOW HUMIDITY':'低濕警示','COLD':'偏冷','NORMAL':'正常環境','MANUAL':'手動控制','WAITING':'等待資料'};
const ledNames={RED:'紅燈',GREEN:'綠燈',BLUE:'藍燈',OFF:'關閉'};
const options=[['NORMAL','正常環境'],['COLD','低溫'],['HIGH TEMP','高溫'],['HIGH HUMIDITY','高濕'],['LOW HUMIDITY','低濕']];
const colors={RED:'#dc2626',GREEN:'#16a34a',BLUE:'#2563eb',OFF:'#94a3b8'};

function decide(t,h){if(!Number.isFinite(t)||!Number.isFinite(h))return 'SENSOR ERROR';if(t>=30)return 'HIGH TEMP';if(h>=70)return 'HIGH HUMIDITY';if(h<30)return 'LOW HUMIDITY';if(t<20)return 'COLD';return 'NORMAL';}
function ledFor(s){return s==='COLD'?'BLUE':s==='NORMAL'?'GREEN':s==='SENSOR ERROR'?'OFF':'RED';}
function decisionPath(t,h){const steps=[],nodes=[];function add(id,label,answer){nodes.push(id);steps.push(label+' → '+answer);}
if(!Number.isFinite(t)||!Number.isFinite(h)){add('n-valid','感測資料有效？','否');return {steps,nodes,result:'r-error',label:'感測器錯誤'};}
add('n-valid','感測資料有效？','是');
const tests=[['n-hot','溫度 ≥ 30°C？',t>=30,'r-hot','高溫警示'],['n-humid','濕度 ≥ 70%？',h>=70,'r-humid','高濕警示'],['n-dry','濕度 ＜ 30%？',h<30,'r-dry','低濕警示'],['n-cold','溫度 ＜ 20°C？',t<20,'r-cold','偏冷']];
for(const test of tests){add(test[0],test[1],test[2]?'是':'否');if(test[2])return {steps,nodes,result:test[3],label:test[4]};}
return {steps,nodes,result:'r-normal',label:'正常環境'};}

let activeGame=null;
function openGame(name){
  if(name!=='speed')stopSpeed(true);
  activeGame=name;
  ['quiz','engineer','speed'].forEach(x=>$(x+'Game').classList.toggle('hidden',x!==name));
  document.querySelectorAll('.game-nav button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.game===name)));
  if(name==='quiz')startQuiz();
  if(name==='engineer')startEngineer();
  if(name==='speed'){
    stopSpeed(true);
    $('speedMeta').textContent='準備挑戰';
    $('speedStart').classList.remove('hidden');
    $('speedStart').textContent='開始 60 秒挑戰';
    $('speedChoices').replaceChildren();
    $('speedValues').replaceChildren();
    $('speedFeedback').textContent='';
    $('speedProgress').style.width='0%';
  }
}
function makeChoices(target,callback,disabled=false){const box=$(target);box.replaceChildren();options.forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.disabled=disabled;b.dataset.answer=id;b.addEventListener('click',()=>callback(id));box.appendChild(b);});}
function markChoices(target,chosen,correct){$(target).querySelectorAll('button').forEach(b=>{b.disabled=true;if(b.dataset.answer===correct)b.classList.add('correct');else if(b.dataset.answer===chosen)b.classList.add('wrong');});}
function metrics(target,t,h){$(target).replaceChildren();[t+'°C',h+'% RH'].forEach(v=>{const e=document.createElement('span');e.textContent=v;$(target).appendChild(e);});}
function explanation(t,h){return decisionPath(t,h).steps.join('　→　')+'　→　'+(labels[decide(t,h)]||'');}
const quizQuestions=[{t:25,h:50},{t:35,h:50},{t:15,h:50},{t:25,h:80},{t:25,h:20},{t:18,h:75},{t:32,h:20},{t:20,h:30},{t:19,h:29},{t:30,h:70}];
let quizIndex=0,quizScore=0,quizAnswered=false;
function startQuiz(){quizIndex=0;quizScore=0;showQuiz();}
function showQuiz(){quizAnswered=false;$('quizFeedback').replaceChildren();$('quizNext').classList.add('hidden');if(quizIndex>=quizQuestions.length){$('quizMeta').textContent='完成！總分：'+quizScore+' / 100';$('quizValues').replaceChildren();$('quizChoices').replaceChildren();$('quizProgress').style.width='100%';const p=document.createElement('p');p.textContent=quizScore>=80?'優秀！已掌握決策樹的優先順序。':'可再練習高溫、高濕、低濕的判斷優先順序。';$('quizFeedback').appendChild(p);return;}
const q=quizQuestions[quizIndex];$('quizMeta').textContent='第 '+(quizIndex+1)+' / 10 題｜目前 '+quizScore+' 分';$('quizProgress').style.width=(quizIndex/10*100)+'%';metrics('quizValues',q.t,q.h);makeChoices('quizChoices',answerQuiz);}
function answerQuiz(chosen){if(quizAnswered)return;quizAnswered=true;const q=quizQuestions[quizIndex],correct=decide(q.t,q.h);if(chosen===correct)quizScore+=10;markChoices('quizChoices',chosen,correct);const p=document.createElement('div');p.className='feedback';p.textContent=(chosen===correct?'答對了！ +10 分。':'答錯了。')+' 正確答案：'+labels[correct]+'。路徑：'+explanation(q.t,q.h);$('quizFeedback').appendChild(p);$('quizMeta').textContent='第 '+(quizIndex+1)+' / 10 題｜目前 '+quizScore+' 分';$('quizProgress').style.width=((quizIndex+1)/10*100)+'%';$('quizNext').textContent=quizIndex===9?'查看成績':'下一題';$('quizNext').classList.remove('hidden');}
function nextQuiz(){quizIndex++;showQuiz();}
const missions=[['讓環境保持正常','NORMAL'],['讓系統判斷為低溫','COLD'],['讓系統判斷為高溫','HIGH TEMP'],['讓系統判斷為高濕','HIGH HUMIDITY'],['讓系統判斷為低濕','LOW HUMIDITY']];
let missionIndex=0,missionSolved=false,missionAttempts=0;
function startEngineer(){missionIndex=0;missionAttempts=0;showMission();}
function showMission(){missionSolved=false;$('missionFeedback').replaceChildren();$('missionNext').classList.add('hidden');$('missionCheck').disabled=false;if(missionIndex>=missions.length){$('missionMeta').textContent='🎉 全部 5 關完成！';$('missionText').textContent='你已成功利用溫溼度條件控制五種決策結果。';$('missionCheck').disabled=true;return;}$('missionMeta').textContent='第 '+(missionIndex+1)+' / 5 關｜累計嘗試 '+missionAttempts+' 次';$('missionText').textContent=missions[missionIndex][0];$('gameTemp').value='25';$('gameHum').value='50';renderEngineer();}
function renderEngineer(){const t=Number($('gameTemp').value),h=Number($('gameHum').value),s=decide(t,h);$('gameTempValue').textContent=t+'°C';$('gameHumValue').textContent=h+'%';$('engineerState').textContent=labels[s];$('engineerLED').textContent=ledNames[ledFor(s)];}
function checkMission(){if(missionSolved||missionIndex>=missions.length)return;missionAttempts++;const t=Number($('gameTemp').value),h=Number($('gameHum').value),s=decide(t,h),ok=s===missions[missionIndex][1];$('missionMeta').textContent='第 '+(missionIndex+1)+' / 5 關｜累計嘗試 '+missionAttempts+' 次';$('missionFeedback').textContent=ok?'挑戰成功！'+explanation(t,h):'還沒達成任務。現在的結果是「'+labels[s]+'」。請注意決策條件的優先順序。';if(ok){missionSolved=true;$('missionCheck').disabled=true;$('missionNext').textContent=missionIndex===4?'查看完成結果':'下一關';$('missionNext').classList.remove('hidden');}}
function nextMission(){missionIndex++;showMission();}
let speedTimer=null,speedEndAt=0,speedScore=0,speedCount=0,speedActive=false,speedQuestion=null;
function stopSpeed(silent=false){if(speedTimer!==null){clearInterval(speedTimer);speedTimer=null;}const wasActive=speedActive;speedActive=false;$('speedStop').classList.add('hidden');$('speedStart').classList.remove('hidden');$('speedStart').textContent='重新開始 60 秒挑戰';$('speedChoices').querySelectorAll('button').forEach(b=>b.disabled=true);if(!silent&&wasActive){$('speedMeta').textContent='時間到！答對 '+speedScore/10+' 題，共 '+speedScore+' 分（已答 '+speedCount+' 題）';$('speedFeedback').textContent='挑戰完成。可以重新開始或切換其他遊戲。';$('speedProgress').style.width='0%';}}
function startSpeed(){stopSpeed(true);speedScore=0;speedCount=0;speedActive=true;speedEndAt=Date.now()+60000;$('speedStart').classList.add('hidden');$('speedStop').classList.remove('hidden');$('speedFeedback').textContent='';newSpeedQuestion();speedTick();speedTimer=setInterval(speedTick,100);}
function speedTick(){if(!speedActive)return;const left=Math.max(0,speedEndAt-Date.now());$('speedMeta').textContent='剩餘 '+Math.ceil(left/1000)+' 秒｜'+speedScore+' 分｜已答 '+speedCount+' 題';$('speedProgress').style.width=(left/60000*100)+'%';if(left<=0)stopSpeed();}
function newSpeedQuestion(){if(!speedActive)return;const t=10+Math.floor(Math.random()*31),h=10+Math.floor(Math.random()*81);speedQuestion={t,h};metrics('speedValues',t,h);makeChoices('speedChoices',answerSpeed);}
function answerSpeed(chosen){if(!speedActive||Date.now()>=speedEndAt){stopSpeed();return;}if(chosen===decide(speedQuestion.t,speedQuestion.h))speedScore+=10;speedCount++;newSpeedQuestion();speedTick();}

function renderLesson(){
  const t=Number($('lessonTemp').value),h=Number($('lessonHum').value),s=decide(t,h);
  $('lessonTempText').textContent=t+'°C';$('lessonHumText').textContent=h+'%';
  $('lessonResult').textContent=labels[s]+'｜虛擬 '+ledNames[ledFor(s)];
  const container=$('lessonPath');container.replaceChildren();
  const p=decisionPath(t,h);
  [...p.steps,'結果：'+p.label].forEach(step=>{const div=document.createElement('div');div.className='lesson-step';div.textContent=step;container.appendChild(div);});
}
openGame('quiz');renderLesson();

// Bind all controls without inline scripts, compatible with strict Content Security Policy.
document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{
  const action=el.dataset.action;
  const commands={
    "openGame('quiz')":()=>openGame('quiz'),"openGame('engineer')":()=>openGame('engineer'),"openGame('speed')":()=>openGame('speed'),
    "nextQuiz()":nextQuiz,"startQuiz()":startQuiz,"checkMission()":checkMission,"nextMission()":nextMission,
    "startEngineer()":startEngineer,"startSpeed()":startSpeed,"stopSpeed()":()=>stopSpeed(),
  };
  if(commands[action])commands[action]();
}));
document.querySelectorAll('[data-input-action]').forEach(el=>el.addEventListener('input',()=>{
  if(el.dataset.inputAction==='renderEngineer()')renderEngineer();
  if(el.dataset.inputAction==='renderLesson()')renderLesson();
}));

document.addEventListener('visibilitychange',()=>{if(!document.hidden && speedActive)speedTick();});
