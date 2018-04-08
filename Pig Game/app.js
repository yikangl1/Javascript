var score, current_score, current_player, play;

start()

function start(){
    score = [0, 0];
    current_score = 0;
    current_player = 1;
    play = true;
    
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score_1').textContent = '0';
    document.getElementById('score_2').textContent = '0';
    document.getElementById('current_1').textContent = '0';
    document.getElementById('current_2').textContent = '0';
    document.getElementById('name_1').textContent = 'Player 1';
    document.getElementById('name_2').textContent = 'Player 2';
    
    document.querySelector('.player_1').classList.remove('winner');
    document.querySelector('.player_2').classList.remove('winner');
    document.querySelector('.player_1').classList.remove('active');
    document.querySelector('.player_2').classList.remove('active');
    
    document.querySelector('.player_1').classList.add('active');
}

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(play){
        var dice, dicedom;
        
        dice = Math.floor(Math.random()*6) + 1;
        dicedom = document.querySelector('.dice');
        dicedom.style.display = 'block';
        dicedom.src = 'dice-' + dice + '.png';
    
        if (dice !== 1){
            current_score += dice;
            document.querySelector('#current_' + current_player).textContent = current_score;
        }else{
            nextPlayer();
        }   
    } 
});

document.querySelector('.btn-hold').addEventListener('click', function(){
    if(play){
        score[current_player - 1] = score[current_player - 1] + current_score;
        document.querySelector('#score_' + current_player).textContent = score[current_player - 1];
        if(score[current_player - 1] >= 10){
            document.querySelector('#name_' + current_player).textContent = 'Winner';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player_' + current_player).classList.add('winner');
            document.querySelector('.player_' + current_player).classList.remove('active');
            play = false;
        }else if(score[current_player - 1] < 10){
            nextPlayer();
        }   
    }
});

function nextPlayer(){
        if (current_player === 1){
            current_player = 2;
        }
        else{
            current_player = 1;
        }
        current_score = 0;
        
        document.getElementById('current_1').textContent = '0';
        document.getElementById('current_2').textContent = '0';
        
        document.querySelector('.player_1').classList.toggle('active');
        document.querySelector('.player_2').classList.toggle('active');
        document.querySelector('.dice').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click',start);
